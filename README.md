# React Descendants

A small runtime agnostic library for tracking descendants within a React application.
Heavily inspired by [@reach/descendants](https://www.npmjs.com/package/@reach/descendants) and [pacocoursey/use-descendants](https://github.com/pacocoursey/use-descendants).

## Release Process

This repo uses **Changesets** for versioning and **GitHub Actions** for automated publishing.

### 1. Create Changesets for Changes

```bash
# Generate a changeset for your changes
bunx changeset
```

- Select which packages are affected by your changes
- Choose the appropriate semantic version bump (patch, minor, major)
- Write a descriptive summary of the changes
- Commit the generated changeset file in `.changeset/`

### 2. Automated Version Management

When you push to the `master` branch, the GitHub Action will:

- **Create a Release PR**: If there are pending changesets, it creates a "Version Packages" PR with updated version numbers, CHANGELOGs, and consumed changeset files

### 3. Release Publication

When the "Version Packages" PR is merged:

- **Automated Build**: Builds only packages using `bun run build-release`
- **Automated Publishing**: Publishes updated packages to NPM via `changeset publish`
- **Git Tagging**: Creates appropriate git tags for the released versions

### Manual Release (if needed)

```bash
# 1. Create changesets for changes
bunx changeset

# 2. Version packages (updates versions + CHANGELOGs)
bun run changeset-version

# 3. Build and publish
bun run changeset-publish
```
