<!--
Soliguide: Useful information for those who need it

SPDX-FileCopyrightText: © 2024 Solinum

SPDX-License-Identifier: AGPL-3.0-only

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

# How can I contribute

## For Solinum internal developers and product owners

- I have direct access to the repository.
- I can manage the issues.
- I can create, review and merge pull requests.
- I can push my commit directly to the origin remote repository.

## For external developers

I can create pull requests and link them to issues.

## Translations

Translations are handled using [Weblate](https://hosted.weblate.org/projects/soliguide/source-code/). A PR is automatically opened if translations in Weblate do not match translations in the main branch.

## Our environments

As for now, we currently use 2 distinct environments for the Soliguide:

- The production one (prod) which is linked to [soliguide.fr](https://soliguide.fr/);
- The demo one which is linked to [fr.demo.soliguide.dev](https://fr.demo.soliguide.dev/). It is used to test our releases;
- The local dev environment.

## Our workflow

> 🎯 Describe the git workflow we use to contribute to the Soliguide project.

### Introduction: our different needs

We have specific needs caused by our business model and the use of our product in a strong social environment.

- [x] The production deployment should be done regularly with stable and tested releases.
- [x] We should be able to deploy hotfixes and tested features without interfering with each other.
- [x] We should be able to deploy to production multiple features in a bulk while developing and testing other features.
- [x] We should be able to review code easily before merging a feature.
- [x] We should be able to add comments to the code when it’s not clear enough.

### Branches

**main** is our main branch. Features are merged to this branch as soon as they are validated and tested. We create releases from this branch.

For hotfixes we create branches from tags and create releases from there. Example:

> To release an hotfix on `v1.3.0`, we create the branch `v1.3.x` from the tag, cherry-pick commits from **main** to fix this version. Then we create a release and deploy it.

On top of this branch, there are other branches corresponding to issues and features. Their name should follow this format _type-name_. _type_ should be one of: _bug_, _feat_, _tech_, _data_, _hotfix_ and _test_ depending on the type of issue this feature is responding. _name_ is a comprehensible 2-3 words sentence summarizing the object of the issue.

> ⚠️ All features should absolutely be linked to issues. If a developer finds a bug s⋅he should create an issue and link its code and pull request (PR) to this issue. The only exception for this is when you create a tech feature but you have to put it to the corresponding project.

If the developer works on an epic split in multiple issues, every part should have its own branch and go through the PR and review stage and be merged to a specific branch dedicated to the epic that will be merged to **main**.

### Merge vs. rebase

> ⚠️ **WARNING**: the golden rule of rebase → NEVER and when I say never, I mean NEVER rebase a branch when a different developer pushes code (like **main** or a big feature).

We can rebase FROM **main** branch, but never TO it. We’ll have conflicts from hell, have to delete local branches to pull remote ones, fiddle with git and the code and nobody wants that ^^’. These branches should only get code with merge and/or rebase→push. Don’t forget to use the command `git push --force` after a rebase.

Every merge or rebase→push should be done after a PR, whoever produced the code.

**main**: this branch should never be merged to another branch. It should only be the other way around. Features branches should be merged to this one when they are tested and reviewed.

The other branches should be rebased from the destination branch before being merged to it. If a feature needs to be split into multiple branches, all sub-branches should be rebased from the base branch after it's been rebased from **main**. After that, the sub-branches should be merged using the `git rebase -i` command to rebase only the useful commits and get in the same time all the new commits from **main**. This way, there will be no merge commit and the git history should be cleaner.

For the same reason, if you made a lot of testing commits, do not hesitate to squash those commits into one using once again `git rebase -i`, so only the final version remains in **main**.

### Commit message

The commit messages should follow the [Conventional Commits specifications](https://www.conventionalcommits.org/en/v1.0.0/).

```xml
<type>([optional scope])[optional !]: <description>

[optional body]

[optional footer(s)]
```

The **type** can be one of the following:

- **build**: Modifies the build system or external dependencies.
- **ci**: Modifies configuration files and scripts for the continuous integration.
- **docs**: Modifies only the documentation.
- **feat**: Updates to create a new feature.
- **fix**: Fixes a bug.
- **perf**: Improves the product performances.
- **refactor**: Improves the code quality without creating features or fixing a bug.
- **style**: Updates to improve visual clarity of the code (space, formatting, missing semicolon, …).
- **test**: Adds missing tests or improves the current ones.

The **scope** is optional and must match one of the package name (e.g. `common` or `location-api`).

The **!** is used for breaking changes.

The **description** simply explains what the commit is accomplishing. We should understand what this commit is doing with the description only. It should be written with a feature point of view.

The **body** details what is included in the commit, if necessary. It should be used especially if the commit is composed of multiple commits squashed together or if a lot of files were modified. It should be written with a dev/code point of view.

The **footer(s)** should be one of:

- _BREAKING CHANGE_: details the breaking change
- _Reviewed-by_: github-username
- _Refs_: #githubIssueNumber

### Issues and GitHub projects

The issues can be created by anybody in the tech team but has to respect a few things. First, you have to assign the PO to this issue (except if it's a tech story, in this case, you have to assign the CTO), add the right labels and _refinement_, set the status to _Analysis_ and the priority. The assigned person refines it and when its ready, we estimate it during a sprint planning and reassign it to the person that will do the ticket. If the ticket has to be done during the next sprint, we update the sprint and update the status to _TODO_.
When you take the ticket and you update the status to _In Progress_. The next part will be in the [pull request section](#markdown-header-pull-requests)

### Pull requests

When you create a pull request, you have to link it to an issue in a GitHub project and update its status to _To Review_, assign yourself and add labels if necessary. If the pull request is supposed to fix a tech story, then you can directly add your pull request to the projects without assigning an existing issue except if its already created. Once the PR is reviewed and the CI validated everything (except for the test coverage part), you can merge it and update the _Points done_ value in the issue (or the PR if it's a tech story) to the real time spent on the code.

### Tags

Tags are automatically generated by _lerna_ when triggering the release creation workflow on **main** or an hotfix branch. The label is chosen according to the commit added during the merge. The labels have the form _vA.b.c_, with A increasing with a breaking change commit, b is increasing when there is at least a commit with a **feat** type and no breaking changes and c is increasing when there is no breaking changes and no **feat** commit.

```bash
./scripts/reuse-annotate.sh --force-dot-license path/to/name-of-the-file-without-license
```

## Sources

Conventional commit: [www.conventionalcommits.org/fr/v1.0.0/](https://www.conventionalcommits.org/fr/v1.0.0/)

Git with agile method: [www.atlassian.com/agile/software-development/git](https://www.atlassian.com/agile/software-development/git)

Atlassian git workflow: [ww.atlassian.com/git/tutorials/comparing-workflows#centralized-workflow](https://www.atlassian.com/git/tutorials/comparing-workflows#centralized-workflow)

OVH UX workflow (in French): [medium.com/@OVHUXLabs/la-puissance-des-workflows-git-12e195cafe44](https://medium.com/@OVHUXLabs/la-puissance-des-workflows-git-12e195cafe44)

Merge and rebases management: [delicious-insights.com/en/posts/getting-solid-at-git-rebase-vs-merge/](https://delicious-insights.com/en/posts/getting-solid-at-git-rebase-vs-merge/)

How to contribute to an open-source project: [blog.davidecoppola.com/2016/11/howto-contribute-to-open-source-project-on-github/](http://blog.davidecoppola.com/2016/11/howto-contribute-to-open-source-project-on-github/)

`git rebase` and `git merge` uses: [www.atlassian.com/git/tutorials/merging-vs-rebasing](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)
