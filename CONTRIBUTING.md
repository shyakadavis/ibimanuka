# IBIMANUKA's contributing guidelines

Thank you for your interest in contributing to our project! Any contribution is highly appreciated and will be reflected on our project ✨

In this guide, you will get an overview of the project structure and setup, as well as the workflow from opening an issue, creating a PR, reviewing, and merging the PR.

## New contributor guide

Here are some resources to help you get started with open source contributions:

- [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github)
- [Set up Git](https://docs.github.com/en/get-started/quickstart/set-up-git)
- [GitHub flow](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Collaborating with pull requests](https://docs.github.com/en/github/collaborating-with-pull-requests)

## Getting your foot in

Our preferred way of providing the opportunity for people to contribute to IBIMANUKA is through a process that starts with creating a new issue, the summary of the workflow that you can expect and should adhere to is the following:

- You see an area of improvement in the code base, this could be a fix, feature, refactoring...etc
- Create an [issue](https://github.com/shyakadavis/ibimanuka/issues) on our GitHub repository.
- Wait until a team member discusses the issue with you, and if both parties are in agreement, you can start working on the issue.
- Once work has started, you can create a draft pull request and remember to link your pull request with the issue.
- Once the work is complete, change the status of the pull request to ready for review.
- We will review the pull request and if all is good, congratulations! 🥳 you are now an IBIMANUKA contributor (Ikimanuka)!
- If not, we will explain the changes that need to be made for the pull request to be merged or why it can't be merged.

If you would like to be more involved in the development of IBIMANUKA, we would like to invite you to our [Discord Server](https://discord.gg/683FABbWpR) where we can have a chat together and get you involved in the project!

### Some simple rules

- Don't work on an issue that is already being worked on by someone else.
- Don't work on something without getting a team member's approval, this is to not waste your time by making you work on something that won't be merged.
- Don't demand for your pull request to be approved and merged.
- Be nice to everyone involved, we are aiming to create a positive community around collaborating and contributing towards IBIMANUKA's development.

## The tech stack

The Runtime:

- [Bun](https://bun.sh/) / [Cloudflare Workers](https://workers.cloudflare.com/)

The Tech Stack:

- [Hono](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [NeonDB](https://neon.tech)
- [Lucia Auth](https://lucia-auth.com/)

Development stuff:

- [Biome](https://biomejs.dev/)

## Getting stuff running

### Cloning the repo

To clone the repo, you firstly need to [fork](https://github.com/shyakadavis/ibimanuka/fork) it, and then clone your copy of `ibimanuka` locally.

```bash
git clone https://github.com/<your-gh-username>/ibimanuka.git
```

### Bun

Bun is used as the package manager of IBIMANUKA. With Bun, you don't need to have NodeJS installed at all on your system to be able to run IBIMANUKA. The only tool you need to install dependencies & run IBIMANUKA is Bun!

To install bun, head over to [their website](https://bun.sh/) which will tell you how to get it installed on your system.

To check that you have Bun installed, simply run the following command:

```bash
bun --version
```

If this commands outputs a version number, you're all good to go.

### Installing dependencies

With bun installed on your machine, the next step would be to install the dependencies that IBIMANUKA relies upon to work, to do this, run the following command:

```bash
bun install
```

### Environment Variables

Now that Bun & dependencies has been installed, it's time to configure your environment variables so that the project works as expected:

1.  Duplicate the `.dev.vars.example` file as just `.dev.vars`
2.  Populate the values with your own, you will need to sign up to some services in the process. (For example, NeonDB)

You can check out which variables are needed and which are optional in the `.dev.vars.example` file.

### Running stuff

```bash
# Generate migration files
bun db:generate

# Migrate the database schema
bun db:migrate

# Run the project's dev server
bun dev

# Lint & Format using Biome
bun check

# Run the typecheck script
bun check:types
```

### Preparing a Pull Request

A good PR is small, focuses on a single feature or improvement, and clearly communicates the problem
it solves. Try not to include more than one issue in a single PR. It's much easier for us to review
multiple small pull requests than one that is large and unwieldy.

If not already done:

1. [Fork the repository](https://github.com/shyakadavis/ibimanuka/fork).

2. Clone the fork to your local machine and add upstream remote:

```sh
git clone https://github.com/<your username>/ibimanuka.git
cd ibimanuka
git remote add upstream https://github.com/ibimanuka/ibimanuka.git
```

3. Synchronize your local `main` branch with the upstream remote:

```sh
git checkout main
git pull upstream main
```

4. Install dependencies with [Bun](https://bun.sh/):

```sh
bun i
```

5. Create a new branch related to your PR:

```sh
git checkout -b fix/bug-being-fixed
```

6. Make changes, then commit and push to your forked repository:

```sh
git push -u origin HEAD
```

7. Go to [the repository](https://github.com/shyakadavis/ibimanuka) and
   [make a Pull Request](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

8. We will review your Pull Request and either merge it, request changes to it, or close it with an
   explanation.

## Closing notes

Again, thank you so much for your interest in contributing to IBIMANUKA, we really appreciate it, and if there is anything we can do to help your journey, make sure to join our [Discord Server](https://discord.gg/683FABbWpR).
