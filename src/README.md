# Minecraft Bedrock Edition Update Log Converter

This tool converts Minecraft Bedrock Edition JSON UI update logs into a simplified JSON format.

## Overview

The `converter.cpp` program is designed to transform Minecraft Bedrock Edition's complex JSON UI update logs into a more compact and easier-to-use JSON format. The original update logs follow Minecraft's JSON UI structure, which can be verbose and difficult to process programmatically. This converter extracts the essential information (versions, subtitles, and log entries) into a cleaner format.

## Features

- Converts Minecraft Bedrock Edition JSON UI format to simplified JSON
- Preserves version numbers, subtitles, and log entries
- Handles both new and legacy JSON UI formats
- Cleans up formatting characters from subtitles
- Outputs to a `.converter` directory by default

## Usage

```bash
g++ -std=c++17 converter.cpp -o converter
chmod +x ./converter        #If Needed
./converter [--debug] -i PATH/TO/ORIGINAL/FILE.json -o OUTPUT_FILE_NAME.json
```

### Parameters

- `--debug`: Optional flag to enable debug output
- `-i PATH/TO/ORIGINAL/FILE.json`: Path to the input Minecraft JSON UI file
- `-o OUTPUT_FILE_NAME.json`: Name of the output JSON file

### Output

The converted JSON will be placed in the `.converter` directory with the specified output filename. The output format is an array of version objects with the following structure:

```json
[
  {
    "logs": ["log_entry_1", "log_entry_2", ...],
    "version": "version_number",
    "subtitle": "subtitle_text_or_null"
  },
  ...
]
```

## Compatibility

This tool is designed to work on Linux platforms and requires a C++17 compatible compiler to build.