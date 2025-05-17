# recently-published

> A simple CLI tool to view which installed packages in your project were published most recently

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
  -ep, --excludePrerelease  Exclude prerelease versions from the list of recently published versions
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
 Name                       Version  Published     Date                   
 eslint                     9.10.0   46 hours ago  Fri Sep 6 2024 4:26 PM
 @eslint/js                 9.10.0   46 hours ago  Fri Sep 6 2024 4:06 PM
 picocolors                 1.1.0    5 days ago    Mon Sep 2 2024 7:46 PM
 typescript-eslint          8.4.0    6 days ago    Mon Sep 2 2024 1:16 PM
 @typescript-eslint/parser  8.4.0    6 days ago    Mon Sep 2 2024 1:16 PM
```

### Get 10 most recently published versions of "react"

```sh
recently-published react
```

returns

```text
 react
 Version                               Published   Date                    
 0.0.0-experimental-a03254bc-20240905  2 days ago  Fri Sep 6 2024 12:20 PM
 19.0.0-rc-a03254bc-20240905           2 days ago  Fri Sep 6 2024 12:18 PM
 0.0.0-experimental-4c58fce7-20240904  3 days ago  Thu Sep 5 2024 12:20 PM
 19.0.0-rc-4c58fce7-20240904           3 days ago  Thu Sep 5 2024 12:18 PM
 0.0.0-experimental-d1afcb43-20240903  4 days ago  Wed Sep 4 2024 12:20 PM
```

### Get 5 most recently published versions of "react" including prerelease versions

```sh
recently-published react -ep
```

returns

```text
 react
 Version  Published     Date                     
 18.3.1   4 months ago  Fri Apr 26 2024 12:42 PM
 18.3.0   4 months ago  Thu Apr 25 2024 12:45 PM
 18.2.0   2 years ago   Tue Jun 14 2022 3:46 PM
 18.1.0   2 years ago   Tue Apr 26 2022 4:40 PM
 18.0.0   2 years ago   Tue Mar 29 2022 12:00 PM
```

### Get all published versions of "ink-spinner" sorted by publish date

```sh
recently-published ink-spinner -d all
```

returns

```text
 ink-spinner
 Version  Published      Date                     
 5.0.0    18 months ago  Wed Mar 1 2023 4:04 PM
 4.0.3    2 years ago    Tue Oct 5 2021 1:19 PM
 4.0.2    3 years ago    Fri May 7 2021 3:09 PM
 4.0.1    4 years ago    Tue Aug 18 2020 2:58 PM
 4.0.0    4 years ago    Sun Jul 26 2020 3:49 PM
 4.0.0-0  4 years ago    Tue Jun 23 2020 3:51 PM
 3.1.0    4 years ago    Tue Jun 23 2020 3:22 PM
 3.0.1    5 years ago    Sun Apr 14 2019 11:14 PM
 3.0.0    5 years ago    Mon Mar 4 2019 2:59 AM
 2.0.0    6 years ago    Sun May 20 2018 2:58 PM
 1.0.0    7 years ago    Sat Jul 15 2017 3:10 PM

```


