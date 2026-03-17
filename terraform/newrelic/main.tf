terraform {
  required_version = ">= 1.3"

  required_providers {
    newrelic = {
      source  = "newrelic/newrelic"
      version = "~> 3.38"
    }
  }

  # Recommended: configure a remote backend so state persists across CI runs.
  # This team uses an S3 backend with DynamoDB state locking — see cr-web/alerts/main.tf
  # for the reference pattern.
  #
  # backend "s3" {
  #   bucket               = "<your-state-bucket>"
  #   dynamodb_table       = "<your-lock-table>"
  #   region               = "us-east-1"
  #   workspace_key_prefix = "opensource-docs/alerts"
  #   key                  = "terraform.tfstate"
  #   encrypt              = true
  # }
  #
  # Without a remote backend, `terraform apply` in CI will recreate resources
  # on every run. Configure the backend above before running in GitHub Actions.
}

provider "newrelic" {
  account_id = var.new_relic_account_id
  api_key    = var.new_relic_api_key
  region     = var.new_relic_region
}
