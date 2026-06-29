#!/usr/bin/env sh
set -eu
markdownlint README.md docs/*.md CONTRIBUTING.md CHANGELOG.md CODE_OF_CONDUCT.md SECURITY.md
yamllint .
