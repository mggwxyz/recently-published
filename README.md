# recently-published

> A simple CLI tool to view which installed packages in your project were published most recently

![](https://github.com/mggwxyz/recently-published/blob/main/demo/gifs/demo.gif)

## Use Case

If you install or update your packages and something breaks, you can use this CLI tool to see which versions you just installed were most recently published and hence the most suspect. 

## Installation & Usage

You can either install this package globally or use `npx` to run it without installation.

### Global Installation

To install globally, use:

```sh
npm install -g recently-published
```

Once installed, you can run it anywhere with:

```sh
recently-published <options>
```

### Using `npx`

If you prefer not to install it globally, you can use `npx`:

```sh
npx recently-published <options>
```

This will fetch and run the latest version of the package without needing a global install.

## Usage

```text
Usage: recently-published [options] [optionalPackageName]

Arguments:
  optionalPackageName       Optional package name whose recently published versions you want to see. If not provided, will display recently published packages installed in the current directory.

Options:
  -V, --version             output the version number
  -d, --display <number>    Number of recently published versions you would like displayed or "all" if you want to display all of them (default: "10")
  -ip, --includePrerelease  Include prerelease versions from the list of recently published versions
  --json                    Output the result in JSON format
  -h, --help                display help for command
```

## Examples

### Get 10 most recently published packages installed in the current directory

```sh
recently-published
```

returns

```text
Name                             Version  Published    Date                     
eslint                           9.27.0   22 hours ago Fri May 16 2025 2:54 PM
@eslint/js                       9.27.0   22 hours ago Fri May 16 2025 2:28 PM
tsup                             8.5.0    27 hours ago Fri May 16 2025 9:41 AM
@types/node                      22.15.18 3 days ago   Wed May 14 2025 12:37 AM
typescript-eslint                8.32.1   4 days ago   Mon May 12 2025 1:19 PM
@typescript-eslint/parser        8.32.1   4 days ago   Mon May 12 2025 1:19 PM
@typescript-eslint/scope-manager 8.32.1   4 days ago   Mon May 12 2025 1:19 PM
@typescript-eslint/visitor-keys  8.32.1   4 days ago   Mon May 12 2025 1:19 PM
semver                           7.7.2    5 days ago   Mon May 12 2025 1:02 PM
execa                            9.5.3    8 days ago   Thu May 8 2025 4:11
```

### Get 10 most recently published versions of "react"

```sh
recently-published react
```

returns

```text
react
Version Published     Date                     
19.1.0  49 days ago   Fri Mar 28 2025 3:59 PM
19.0.0  5 months ago  Thu Dec 5 2024 1:10 PM
18.3.1  12 months ago Fri Apr 26 2024 12:42 PM
18.3.0  12 months ago Thu Apr 25 2024 12:45 PM
18.2.0  2 years ago   Tue Jun 14 2022 3:46 PM
18.1.0  3 years ago   Tue Apr 26 2022 4:40 PM
18.0.0  3 years ago   Tue Mar 29 2022 12:00 PM
17.0.2  4 years ago   Mon Mar 22 2021 5:56 PM
17.0.1  4 years ago   Thu Oct 22 2020 8:21 AM
17.0.0  4 years ago   Tue Oct 20 2020 4:11 PM
```

### Get 10 most recently published versions of "react" including prerelease versions

```sh
recently-published react -ip
```

returns

```text
react
Version                              Published    Date                     
0.0.0-experimental-4448b187-20250515 24 hours ago Fri May 16 2025 12:20 PM
19.2.0-canary-4448b187-20250515      24 hours ago Fri May 16 2025 12:18 PM
0.0.0-experimental-4a45ba92-20250515 2 days ago   Thu May 15 2025 12:20 PM
19.2.0-canary-4a45ba92-20250515      2 days ago   Thu May 15 2025 12:18 PM
0.0.0-experimental-d85f86cf-20250514 3 days ago   Wed May 14 2025 12:20 PM
19.2.0-canary-d85f86cf-20250514      3 days ago   Wed May 14 2025 12:18 PM
0.0.0-experimental-b94603b9-20250513 4 days ago   Tue May 13 2025 12:20 PM
19.2.0-canary-b94603b9-20250513      4 days ago   Tue May 13 2025 12:18 PM
0.0.0-experimental-3820740a-20250509 5 days ago   Mon May 12 2025 12:20 PM
19.2.0-canary-3820740a-20250509      5 days ago   Mon May 12 2025 12:18 PM
```

### Get all published versions of "ink-spinner" sorted by publish date

```sh
recently-published ink-spinner -d all
```

returns

```text
ink-spinner
Version Published   Date                     
5.0.0   2 years ago Wed Mar 1 2023 4:04 PM
4.0.3   3 years ago Tue Oct 5 2021 1:19 PM
4.0.2   4 years ago Fri May 7 2021 3:09 PM
4.0.1   4 years ago Tue Aug 18 2020 2:58 PM
4.0.0   4 years ago Sun Jul 26 2020 3:49 PM
3.1.0   4 years ago Tue Jun 23 2020 3:22 PM
3.0.1   6 years ago Sun Apr 14 2019 11:14 PM
3.0.0   6 years ago Mon Mar 4 2019 2:59 AM
2.0.0   6 years ago Sun May 20 2018 2:58 PM
1.0.0   7 years ago Sat Jul 15 2017 3:10 PM
```


