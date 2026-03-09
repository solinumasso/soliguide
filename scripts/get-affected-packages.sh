#!/usr/bin/env bash


set -o errexit
set -o pipefail
set -o nounset

DIRNAME=$(dirname "$0")

# Move to project root directory
cd "${DIRNAME}/.."

# Output for variables
GITHUB_OUTPUT="${GITHUB_OUTPUT:-/dev/stderr}"

# Disable pipefail temporarly, we check the return value anyway
set +e
# Get list of packages with differences compared to the content in branch `main`
AFFECTED_PACKAGES=$(yarn workspaces list --since | grep -Eo 'packages/.+' | sed -Ee 's/^packages\/(.+)$/\1/')
set -o pipefail

# Stop there if there is no affected packages
if [ -z "${AFFECTED_PACKAGES}" ]; then
  {
    echo "to_build=[]"
    echo "to_test=[]"
    echo "to_deploy=[]"
  } >> "$GITHUB_OUTPUT"
  exit 0
fi

ALL_PACKAGES=$(yarn workspaces list | grep -Eo 'packages/.+' | sed -Ee 's/^packages\/(.+)$/\1/')

# Packages that can be deployed. Typically not common or common-angular
DEPLOYABLE_PACKAGES=("api" "design-system" "frontend" "location-api" "maintenance" "soligare" "web-app" "widget")

echo "Affected packages:"
printf '%s\n' "${AFFECTED_PACKAGES[@]}"

PACKAGES_TO_BUILD=()
PACKAGES_TO_TEST=()

function addPackageToBuild() {
  local package="$1"
  if [[ ! " ${PACKAGES_TO_BUILD[*]} " =~ [[:space:]]${package}[[:space:]] ]]; then
    PACKAGES_TO_BUILD+=("$package")
  fi
}

function doesPackageADependsOnPackageB() {
  local packageA="$1"
  local packageB="$2"
  local dependencies=$(jq "if .dependencies == null then .devDependencies else .dependencies end | with_entries(select(.key == \"@soliguide/${packageB}\")) | length > 0" < "packages/${packageA}/package.json")
  [[ "$dependencies" == "true" ]]
}

function addPackageToBuildAndDependencies() {
  # Packages to build because:
  # 1. they are affected directly
  # 2. they are required by the affected package
  local package="$1"
  addPackageToBuild "$package"
  for p in $ALL_PACKAGES; do
    if doesPackageADependsOnPackageB "$package" "$p"; then
      addPackageToBuild "$p"
    fi
  done
}

function addPackageToTest() {
  # Packages to test because:
  # 1. they are affected directly
  # 2. they are affected indirectly, they statically depend on affected packages
  local package="$1"
  if [[ ! " ${PACKAGES_TO_TEST[*]} " =~ [[:space:]]${package}[[:space:]] ]]; then
    PACKAGES_TO_TEST+=("$package")
  fi
  for p in $ALL_PACKAGES; do
    if doesPackageADependsOnPackageB "$p" "$package"; then
      addPackageToTest "$p"
      addPackageToBuildAndDependencies "$p"
    fi
  done
}

for package in $AFFECTED_PACKAGES; do
  addPackageToBuildAndDependencies "$package"
  addPackageToTest "$package"
done

echo ""
echo "Packages to test:"
printf '%s\n' "${PACKAGES_TO_TEST[@]}"

PACKAGES_TO_DEPLOY=()

function addPackageToDeploy() {
  # Packages to deploy because:
  # 1. they are affected directly
  # 2. they are affected indirectly, they statically depend on affected packages
  local package="$1"
  if [[ ! " ${PACKAGES_TO_DEPLOY[*]} " =~ [[:space:]]${package}[[:space:]] ]] && [[ " ${DEPLOYABLE_PACKAGES[*]} " =~ [[:space:]]${package}[[:space:]] ]]; then
    PACKAGES_TO_DEPLOY+=("$package")
  fi
  addPackageToBuildAndDependencies "$package"
  if [[ "$package" == "frontend" ]]; then
    addPackageToDeploy api
    addPackageToDeploy location-api
    addPackageToDeploy maintenance
    addPackageToDeploy soligare
  elif [[ "$package" == "soligare" ]]; then
    addPackageToDeploy api
  elif [[ "$package" == "web-app" ]]; then
    addPackageToDeploy api
    addPackageToDeploy location-api
  elif [[ "$package" == "widget" ]]; then
    addPackageToDeploy api
    addPackageToDeploy location-api
    addPackageToDeploy maintenance
  fi
}

for package in "${PACKAGES_TO_TEST[@]}"; do
  addPackageToDeploy "$package"
  # Add packages that may be affected at runtime, therefore useful to deploy
  if [[ "$package" == "api" ]]; then
    addPackageToDeploy frontend
    addPackageToDeploy soligare
    addPackageToDeploy web-app
    addPackageToDeploy widget
  elif [[ "$package" == "location-api" ]]; then
    addPackageToDeploy frontend
    addPackageToDeploy web-app
    addPackageToDeploy widget
  elif [[ "$package" == "soligare" ]]; then
    addPackageToDeploy frontend
  elif [[ "$package" == "maintenance" ]]; then
    addPackageToDeploy frontend
    addPackageToDeploy widget
  fi
done

echo ""
echo "Packages to build:"
printf '%s\n' "${PACKAGES_TO_BUILD[@]}"

echo ""
echo "Packages to deploy:"
printf '%s\n' "${PACKAGES_TO_DEPLOY[@]}"

# JSON output in Github Output format
{
  echo to_build=$(printf '%s\n' "${PACKAGES_TO_BUILD[@]}" |  jq -R . | jq -s .)
  echo to_test=$(printf '%s\n' "${PACKAGES_TO_TEST[@]}" |  jq -R . | jq -s .)
  echo to_deploy=$(printf '%s\n' "${PACKAGES_TO_DEPLOY[@]}" |  jq -R . | jq -s .)
} >> "$GITHUB_OUTPUT"
