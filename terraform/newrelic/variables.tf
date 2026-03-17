variable "service" {
  description = "Kebab-case service name — used in resource naming convention cai-<service>-<env>"
  type        = string
  default     = "opensource-docs"
}

variable "new_relic_account_id" {
  description = "New Relic account ID (NR UI → Account settings)"
  type        = number
}

variable "new_relic_api_key" {
  description = "New Relic User API key (NR UI → API Keys → create a User key)"
  type        = string
  sensitive   = true
}

variable "new_relic_region" {
  description = "New Relic data center region: US or EU"
  type        = string
  default     = "US"

  validation {
    condition     = contains(["US", "EU"], var.new_relic_region)
    error_message = "Region must be either US or EU."
  }
}

variable "alert_email" {
  description = "Email address to receive Synthetics failure alerts"
  type        = string
}

variable "site_fqdn" {
  description = "Base URL of the documentation site (trailing slash required)"
  type        = string
  default     = "https://opensource.contentauthenticity.org/"
}

variable "environment" {
  description = "Deployment environment name — used in resource naming (e.g. prod)"
  type        = string
  default     = "prod"
}
