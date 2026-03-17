# ---------------------------------------------------------------------------
# Alert policy
# Naming convention: cai-<service>-policy-<env>  (matches cai/tf-modules pattern)
# ---------------------------------------------------------------------------
resource "newrelic_alert_policy" "contentauth_docs" {
  name                = "cai-${var.service}-policy-${var.environment}"
  incident_preference = "PER_CONDITION"
}

# ---------------------------------------------------------------------------
# NRQL alert condition — fires when a Synthetics monitor reports a failure
#
# Key differences from the initial version, aligned with cai/tf-modules:
#   - NRQL uses entityGuid (stable entity reference) instead of monitorName
#   - Adds a warning threshold (1 failure) alongside critical (5 failures)
#   - Uses event_timer aggregation (60 s timer) — same as the internal module
#   - violation_time_limit_seconds: 12 hours (43200 s)
# ---------------------------------------------------------------------------
resource "newrelic_nrql_alert_condition" "monitor_failure" {
  account_id  = var.new_relic_account_id
  policy_id   = newrelic_alert_policy.contentauth_docs.id
  type        = "static"
  name        = "cai-${var.service}-synthetic-failure"
  description = "A Synthetics monitor detected a doc page that is down or returning non-200 (e.g. 404)."
  enabled     = true

  nrql {
    query = <<-EOQ
      SELECT count(result)
      FROM SyntheticCheck
      WHERE entityGuid IN (
        '${newrelic_synthetics_script_monitor.homepage.id}',
        '${newrelic_synthetics_script_monitor.doc_pages_404.id}'
      )
      AND result != 'SUCCESS'
      FACET location, locationLabel
    EOQ
  }

  warning {
    operator              = "above"
    threshold             = 1
    threshold_duration    = 180 # 3 minutes
    threshold_occurrences = "ALL"
  }

  critical {
    operator              = "above"
    threshold             = 5
    threshold_duration    = 180 # 3 minutes
    threshold_occurrences = "ALL"
  }

  aggregation_window            = 60
  aggregation_method            = "event_timer"
  aggregation_timer             = 60
  fill_option                   = "none"
  violation_time_limit_seconds  = 43200 # 12 hours
}

# ---------------------------------------------------------------------------
# Notification destination — email
# ---------------------------------------------------------------------------
resource "newrelic_notification_destination" "email" {
  name = "cai-${var.service}-email-${var.environment}"
  type = "EMAIL"

  property {
    key   = "email"
    value = var.alert_email
  }
}

# ---------------------------------------------------------------------------
# Notification channels — critical and warning (separate, matching the module pattern)
# ---------------------------------------------------------------------------
resource "newrelic_notification_channel" "critical" {
  name           = "cai-${var.service}-email-critical-${var.environment}"
  type           = "EMAIL"
  destination_id = newrelic_notification_destination.email.id
  product        = "IINT"

  property {
    key   = "subject"
    value = "[CRITICAL] ContentAuth Docs alert: {{issueTitle}}"
  }
}

resource "newrelic_notification_channel" "warning" {
  name           = "cai-${var.service}-email-warning-${var.environment}"
  type           = "EMAIL"
  destination_id = newrelic_notification_destination.email.id
  product        = "IINT"

  property {
    key   = "subject"
    value = "[WARNING] ContentAuth Docs alert: {{issueTitle}}"
  }
}

# ---------------------------------------------------------------------------
# Workflows — separate critical and warning (matches cai/tf-modules pattern)
# Naming convention: cai-<service>-<severity>-<env>
# ---------------------------------------------------------------------------
resource "newrelic_workflow" "critical" {
  name                  = "cai-${var.service}-critical-${var.environment}"
  muting_rules_handling = "DONT_NOTIFY_FULLY_MUTED_ISSUES"
  enabled               = true

  issues_filter {
    name = "Filter by policy and critical priority"
    type = "FILTER"

    predicate {
      attribute = "labels.policyIds"
      operator  = "EXACTLY_MATCHES"
      values    = [tostring(newrelic_alert_policy.contentauth_docs.id)]
    }

    predicate {
      attribute = "priority"
      operator  = "EXACTLY_MATCHES"
      values    = ["CRITICAL"]
    }
  }

  destination {
    channel_id            = newrelic_notification_channel.critical.id
    notification_triggers = ["ACKNOWLEDGED", "ACTIVATED", "CLOSED"]
  }
}

resource "newrelic_workflow" "warning" {
  name                  = "cai-${var.service}-warning-${var.environment}"
  muting_rules_handling = "DONT_NOTIFY_FULLY_MUTED_ISSUES"
  enabled               = true

  issues_filter {
    name = "Filter by policy and high priority"
    type = "FILTER"

    predicate {
      attribute = "labels.policyIds"
      operator  = "EXACTLY_MATCHES"
      values    = [tostring(newrelic_alert_policy.contentauth_docs.id)]
    }

    predicate {
      attribute = "priority"
      operator  = "EXACTLY_MATCHES"
      values    = ["HIGH"]
    }
  }

  destination {
    channel_id            = newrelic_notification_channel.warning.id
    notification_triggers = ["ACKNOWLEDGED", "ACTIVATED", "CLOSED"]
  }
}
