# Locations used by all monitors.
# Matches the production location set used in cai/tf-modules new-relic-alerts module.
locals {
  # NR API stores location names without the AWS_ prefix — use short form to avoid
  # perpetual drift between config and state on every plan.
  monitor_locations = [
    "AP_EAST_1",
    "AP_SOUTH_1",
    "AP_SOUTHEAST_1",
    "AP_NORTHEAST_1",
    "AP_NORTHEAST_2",
    "AP_SOUTHEAST_2",
    "US_WEST_1",
    "US_WEST_2",
    "US_EAST_1",
    "US_EAST_2",
    "CA_CENTRAL_1",
    "SA_EAST_1",
    "EU_WEST_1",
    "EU_WEST_2",
    "EU_WEST_3",
    "EU_CENTRAL_1",
    "EU_NORTH_1",
    "EU_SOUTH_1",
    "ME_SOUTH_1",
    "AF_SOUTH_1",
  ]
}

# ---------------------------------------------------------------------------
# SCRIPT_BROWSER monitor — homepage content check
# Uses Selenium ($webDriver) to load the homepage and assert that:
#   - The page does NOT show "Page Not Found" / 404
#   - Navigation and main content elements are rendered
# Naming convention: cai-<service>-<env>  (matches cai/tf-modules pattern)
# ---------------------------------------------------------------------------
resource "newrelic_synthetics_script_monitor" "homepage" {
  name   = "cai-${var.service}-${var.environment}"
  type   = "SCRIPT_BROWSER"
  period = "EVERY_15_MINUTES"
  status = "ENABLED"

  runtime_type         = "CHROME_BROWSER"
  runtime_type_version = "100"
  script_language      = "JAVASCRIPT"

  locations_public = local.monitor_locations

  script = templatefile("${path.module}/scripts/homepage_health_check.js.tftpl", {
    TEST_FQDN = "'${var.site_fqdn}'"
  })

  tag {
    key    = "service"
    values = [var.service]
  }

  tag {
    key    = "env"
    values = [var.environment]
  }

  tag {
    key    = "team"
    values = ["CAI"]
  }
}

# ---------------------------------------------------------------------------
# SCRIPT_API monitor — checks multiple key doc pages for 404s
# Uses $http (not a browser) to rapidly check HTTP status across 7 URLs.
# This directly targets the reported issue: search results pointing to 404 pages.
# Naming convention: cai-<service>-page-health-<env>
# ---------------------------------------------------------------------------
resource "newrelic_synthetics_script_monitor" "doc_pages_404" {
  name   = "cai-${var.service}-page-health-${var.environment}"
  type   = "SCRIPT_API"
  period = "EVERY_15_MINUTES"
  status = "ENABLED"

  runtime_type         = "NODE_API"
  runtime_type_version = "16.10"
  script_language      = "JAVASCRIPT"

  locations_public = local.monitor_locations

  script = templatefile("${path.module}/scripts/doc_pages_404_check.js.tftpl", {
    TEST_FQDN = "'${var.site_fqdn}'"
  })

  tag {
    key    = "service"
    values = [var.service]
  }

  tag {
    key    = "env"
    values = [var.environment]
  }

  tag {
    key    = "team"
    values = ["CAI"]
  }
}
