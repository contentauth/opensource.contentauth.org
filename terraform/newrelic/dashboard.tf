# ---------------------------------------------------------------------------
# New Relic One dashboard — ContentAuth Docs site health
# NRQL uses entityGuid for stable monitor references (aligned with cai/tf-modules)
# ---------------------------------------------------------------------------
resource "newrelic_one_dashboard" "contentauth_docs" {
  name        = "ContentAuth Docs — Site Health (${var.environment})"
  permissions = "public_read_only"

  page {
    name = "Site Health"

    # Row 1 — KPI billboards
    widget_billboard {
      title  = "Success Rate (24 h)"
      row    = 1
      column = 1
      width  = 4
      height = 3

      nrql_query {
        account_id = var.new_relic_account_id
        query      = <<-EOQ
          SELECT percentage(count(*), WHERE result = 'SUCCESS') AS 'Success Rate'
          FROM SyntheticCheck
          WHERE entityGuid IN (
            '${newrelic_synthetics_script_monitor.homepage.id}',
            '${newrelic_synthetics_script_monitor.doc_pages_404.id}'
          )
          SINCE 24 hours ago
        EOQ
      }

      warning  = 99
      critical = 95
    }

    widget_billboard {
      title  = "Failed Checks (24 h)"
      row    = 1
      column = 5
      width  = 4
      height = 3

      nrql_query {
        account_id = var.new_relic_account_id
        query      = <<-EOQ
          SELECT count(*) AS 'Failures'
          FROM SyntheticCheck
          WHERE entityGuid IN (
            '${newrelic_synthetics_script_monitor.homepage.id}',
            '${newrelic_synthetics_script_monitor.doc_pages_404.id}'
          )
          AND result != 'SUCCESS'
          SINCE 24 hours ago
        EOQ
      }

      critical = 1
    }

    widget_billboard {
      title  = "Avg Response Time (24 h)"
      row    = 1
      column = 9
      width  = 4
      height = 3

      nrql_query {
        account_id = var.new_relic_account_id
        query      = <<-EOQ
          SELECT average(duration) AS 'Avg Duration (ms)'
          FROM SyntheticCheck
          WHERE entityGuid IN (
            '${newrelic_synthetics_script_monitor.homepage.id}',
            '${newrelic_synthetics_script_monitor.doc_pages_404.id}'
          )
          SINCE 24 hours ago
        EOQ
      }

      warning  = 3000
      critical = 8000
    }

    # Row 4 — success rate trend per monitor
    widget_line {
      title  = "Monitor Success Rate — 7 days"
      row    = 4
      column = 1
      width  = 12
      height = 3

      nrql_query {
        account_id = var.new_relic_account_id
        query      = <<-EOQ
          SELECT percentage(count(*), WHERE result = 'SUCCESS') AS 'Success %'
          FROM SyntheticCheck
          WHERE entityGuid IN (
            '${newrelic_synthetics_script_monitor.homepage.id}',
            '${newrelic_synthetics_script_monitor.doc_pages_404.id}'
          )
          FACET monitorName
          TIMESERIES AUTO
          SINCE 7 days ago
        EOQ
      }
    }

    # Row 7 — failure table (most useful for triaging 404 incidents)
    widget_table {
      title  = "Recent Monitor Failures"
      row    = 7
      column = 1
      width  = 12
      height = 5

      nrql_query {
        account_id = var.new_relic_account_id
        query      = <<-EOQ
          SELECT
            timestamp,
            monitorName,
            result,
            duration,
            locationLabel,
            error
          FROM SyntheticCheck
          WHERE entityGuid IN (
            '${newrelic_synthetics_script_monitor.homepage.id}',
            '${newrelic_synthetics_script_monitor.doc_pages_404.id}'
          )
          AND result != 'SUCCESS'
          SINCE 7 days ago
          LIMIT 100
        EOQ
      }
    }
  }
}

output "dashboard_url" {
  description = "URL of the New Relic site health dashboard"
  value       = "https://one.newrelic.com/dashboards/${newrelic_one_dashboard.contentauth_docs.guid}"
}
