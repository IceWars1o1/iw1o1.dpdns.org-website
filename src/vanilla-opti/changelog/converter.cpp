#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <map>
#include <regex>
#include <filesystem>
#include <algorithm>

namespace fs = std::filesystem;


enum class JsonType {
    Null,
    Bool,
    Number,
    String,
    Object,
    Array
};

struct JsonValue {
    JsonType type = JsonType::Null;
    std::string stringValue;
    double numberValue = 0;
    bool boolValue = false;
    std::map<std::string, JsonValue> objectValue;
    std::vector<JsonValue> arrayValue;
    
    JsonValue() = default;
    JsonValue(const std::string& s) : type(JsonType::String), stringValue(s) {}
    JsonValue(const char* s) : type(JsonType::String), stringValue(s) {}
    JsonValue(double n) : type(JsonType::Number), numberValue(n) {}
    JsonValue(bool b) : type(JsonType::Bool), boolValue(b) {}
    
    bool isNull() const { return type == JsonType::Null; }
    bool isString() const { return type == JsonType::String; }
    bool isNumber() const { return type == JsonType::Number; }
    bool isBool() const { return type == JsonType::Bool; }
    bool isObject() const { return type == JsonType::Object; }
    bool isArray() const { return type == JsonType::Array; }
    
    const std::string& asString() const { return stringValue; }
    double asNumber() const { return numberValue; }
    bool asBool() const { return boolValue; }
    
    JsonValue& operator[](const std::string& key) {
        type = JsonType::Object;
        return objectValue[key];
    }
    
    void push_back(const JsonValue& val) {
        type = JsonType::Array;
        arrayValue.push_back(val);
    }
    
    bool has(const std::string& key) const {
        return objectValue.find(key) != objectValue.end();
    }
    
    const JsonValue& at(const std::string& key) const {
        return objectValue.at(key);
    }
};


class JsonParser {
    std::string_view str;
    size_t pos = 0;
    
public:
    explicit JsonParser(std::string_view s) : str(s) {}
    
    JsonValue parse() {
        skipWhitespace();
        return parseValue();
    }
    
private:
    void skipWhitespace() {
        while (pos < str.size() && std::isspace(str[pos])) pos++;
    }
    
    JsonValue parseValue() {
        skipWhitespace();
        if (pos >= str.size()) return JsonValue();
        
        char c = str[pos];
        if (c == '"') return parseString();
        if (c == '{') return parseObject();
        if (c == '[') return parseArray();
        if (c == 't' || c == 'f') return parseBool();
        if (c == 'n') return parseNull();
        return parseNumber();
    }
    
    JsonValue parseString() {
        pos++; 
        std::string result;
        while (pos < str.size() && str[pos] != '"') {
            if (str[pos] == '\\' && pos + 1 < str.size()) {
                char next = str[pos + 1];
                switch (next) {
                    case '"': result += '"'; break;
                    case '\\': result += '\\'; break;
                    case '/': result += '/'; break;
                    case 'b': result += '\b'; break;
                    case 'f': result += '\f'; break;
                    case 'n': result += '\n'; break;
                    case 'r': result += '\r'; break;
                    case 't': result += '\t'; break;
                    default: result += next; break;
                }
                pos += 2;
            } else {
                result += str[pos++];
            }
        }
        if (pos < str.size() && str[pos] == '"') pos++;
        return JsonValue(result);
    }
    
    JsonValue parseObject() {
        pos++; 
        JsonValue obj;
        obj.type = JsonType::Object;
        skipWhitespace();
        
        if (pos < str.size() && str[pos] == '}') {
            pos++;
            return obj;
        }
        
        while (pos < str.size()) {
            skipWhitespace();
            std::string key = parseString().asString();
            skipWhitespace();
            if (pos < str.size() && str[pos] == ':') pos++;
            skipWhitespace();
            
            JsonValue val = parseValue();
            obj.objectValue[key] = val;
            
            skipWhitespace();
            if (pos >= str.size()) break;
            if (str[pos] == ',') {
                pos++;
                continue;
            }
            if (str[pos] == '}') {
                pos++;
                break;
            }
        }
        return obj;
    }
    
    JsonValue parseArray() {
        pos++; 
        JsonValue arr;
        arr.type = JsonType::Array;
        skipWhitespace();
        
        if (pos < str.size() && str[pos] == ']') {
            pos++;
            return arr;
        }
        
        while (pos < str.size()) {
            skipWhitespace();
            arr.arrayValue.push_back(parseValue());
            skipWhitespace();
            
            if (pos >= str.size()) break;
            if (str[pos] == ',') {
                pos++;
                continue;
            }
            if (str[pos] == ']') {
                pos++;
                break;
            }
        }
        return arr;
    }
    
    JsonValue parseBool() {
        if (str.substr(pos, 4) == "true") {
            pos += 4;
            return JsonValue(true);
        }
        if (str.substr(pos, 5) == "false") {
            pos += 5;
            return JsonValue(false);
        }
        return JsonValue();
    }
    
    JsonValue parseNull() {
        if (str.substr(pos, 4) == "null") {
            pos += 4;
        }
        return JsonValue();
    }
    
    JsonValue parseNumber() {
        size_t start = pos;
        if (str[pos] == '-') pos++;
        while (pos < str.size() && std::isdigit(str[pos])) pos++;
        if (pos < str.size() && str[pos] == '.') {
            pos++;
            while (pos < str.size() && std::isdigit(str[pos])) pos++;
        }
        std::string numStr = std::string(str.substr(start, pos - start));
        return JsonValue(std::stod(numStr));
    }
};


std::string jsonEscape(const std::string& s) {
    std::string result;
    for (char c : s) {
        switch (c) {
            case '"': result += "\\\""; break;
            case '\\': result += "\\\\"; break;
            case '\b': result += "\\b"; break;
            case '\f': result += "\\f"; break;
            case '\n': result += "\\n"; break;
            case '\r': result += "\\r"; break;
            case '\t': result += "\\t"; break;
            default: result += c; break;
        }
    }
    return result;
}

void serializeJson(std::ostream& out, const JsonValue& val, int indent = 0) {
    std::string indentStr(indent * 2, ' ');
    
    switch (val.type) {
        case JsonType::Null:
            out << "null";
            break;
        case JsonType::Bool:
            out << (val.boolValue ? "true" : "false");
            break;
        case JsonType::Number:
            out << val.numberValue;
            break;
        case JsonType::String:
            out << "\"" << jsonEscape(val.stringValue) << "\"";
            break;
        case JsonType::Array: {
            out << "[\n";
            for (size_t i = 0; i < val.arrayValue.size(); i++) {
                out << indentStr << "  ";
                serializeJson(out, val.arrayValue[i], indent + 1);
                if (i + 1 < val.arrayValue.size()) out << ",";
                out << "\n";
            }
            out << indentStr << "]";
            break;
        }
        case JsonType::Object: {
            out << "{\n";
            size_t i = 0;
            for (const auto& [key, value] : val.objectValue) {
                out << indentStr << "  \"" << jsonEscape(key) << "\": ";
                serializeJson(out, value, indent + 1);
                if (++i < val.objectValue.size()) out << ",";
                out << "\n";
            }
            out << indentStr << "}";
            break;
        }
    }
}

std::string cleanSubtitle(const std::string& raw) {
    static const std::regex prefixRegex("^§l§o");
    return std::regex_replace(raw, prefixRegex, "");
}

JsonValue convertUpdateJson(const JsonValue& original, bool debug = false) {
    JsonValue result;
    result.type = JsonType::Array;
    
    if (!original.has("update_section")) {
        if (debug) std::cerr << "Debug: No update_section found\n";
        return result;
    }
    
    const JsonValue& section = original.at("update_section");
    if (!section.has("controls")) {
        if (debug) std::cerr << "Debug: No controls found\n";
        return result;
    }
    
    const JsonValue& controls = section.at("controls");
    if (!controls.isArray()) {
        if (debug) std::cerr << "Debug: controls is not array\n";
        return result;
    }
    
    if (debug) std::cerr << "Debug: Total controls: " << controls.arrayValue.size() << "\n";
    
    std::string currentVersion;
    std::string currentSubtitle;
    std::vector<std::string> currentLogs;
    int versionCount = 0;
    
    for (size_t idx = 0; idx < controls.arrayValue.size(); idx++) {
        const auto& item = controls.arrayValue[idx];
        if (!item.isObject()) continue;
        
        std::string key;
        for (const auto& [k, v] : item.objectValue) {
            key = k;
            break;
        }
        
        const JsonValue& control = item.objectValue.at(key);
        
        
        if (key.find("_title") != std::string::npos) {
            if (!currentVersion.empty()) { 
                if (debug) std::cerr << "Debug: Saving version " << currentVersion << " with " << currentLogs.size() << " logs\n";
                
                JsonValue versionObj;
                versionObj["version"] = JsonValue(currentVersion);
                if(currentSubtitle.empty()) {
                    versionObj["subtitle"] = JsonValue();
                } else {
                    versionObj["subtitle"] = JsonValue(currentSubtitle);
                }
                
                JsonValue logsArr;
                logsArr.type = JsonType::Array;
                for (const auto& log : currentLogs) {
                    logsArr.push_back(JsonValue(log));
                }
                versionObj["logs"] = logsArr;
                
                result.push_back(versionObj);
                versionCount++;
            }
            
            currentVersion.clear();
            currentSubtitle.clear();
            currentLogs.clear();
            
            bool foundVersion = false;
            
            if (control.has("$version_text")) {
                currentVersion = control.at("$version_text").asString();
                foundVersion = true;
                if (debug) std::cerr << "Debug: Found new format version: " << currentVersion << "\n";
                
                if (control.has("$update_name_text")) {
                    currentSubtitle = cleanSubtitle(control.at("$update_name_text").asString());
                    if (debug) std::cerr << "Debug: Found subtitle: " << currentSubtitle << "\n";
                } else {
                    if (debug) std::cerr << "Debug: No subtitle for this version\n";
                }
            } else if (control.has("text")) {
                currentVersion = control.at("text").asString();
                foundVersion = true;
                if (debug) std::cerr << "Debug: Found text-only version: " << currentVersion << "\n";
            } else if (control.has("type")) {
                std::string type = control.at("type").asString();
                if (type == "label" && control.has("text")) {
                    currentVersion = control.at("text").asString();
                    foundVersion = true;
                    if (debug) std::cerr << "Debug: Found old format (simple) version: " << currentVersion << "\n";
                } else if (type == "stack_panel" && control.has("controls")) {
                    const JsonValue& spControls = control.at("controls");
                    if (spControls.isArray() && !spControls.arrayValue.empty()) {
                        const JsonValue& first = spControls.arrayValue[0];
                        if (first.isObject()) {
                            for (const auto& [k, v] : first.objectValue) {
                                if (v.isObject() && v.has("text")) {
                                    currentVersion = v.at("text").asString();
                                    foundVersion = true;
                                    if (debug) std::cerr << "Debug: Found old format (complex) version: " << currentVersion << "\n";
                                }
                                break;
                            }
                        }
                        
                        for (const auto& ctrl : spControls.arrayValue) {
                            if (!ctrl.isObject()) continue;
                            for (const auto& [k, v] : ctrl.objectValue) {
                                if (k == "update_name" && v.isObject() && v.has("text")) {
                                    currentSubtitle = cleanSubtitle(v.at("text").asString());
                                    if (debug) std::cerr << "Debug: Found old format subtitle: " << currentSubtitle << "\n";
                                }
                            }
                        }
                    }
                }
            }
            
            if (!foundVersion) {
                if (debug) std::cerr << "Debug: Warning - could not extract version from title: " << key << "\n";
            }
            
        } else if (key.find("_padding") != std::string::npos) {
            
            if (debug) std::cerr << "Debug: Skipping padding: " << key << "\n";
            
        } else if (key.find('@') != std::string::npos && key.find("_title") == std::string::npos && key.find("_padding") == std::string::npos) {
            
            if (control.has("text")) {
                currentLogs.push_back(control.at("text").asString());
                
            } else {
                if (debug) std::cerr << "Debug: Warning - log entry without text: " << key << "\n";
            }
        } else {
            if (debug) std::cerr << "Debug: Unrecognized key pattern: " << key << "\n";
        }
    }
    
    
    if (!currentVersion.empty()) {
        if (debug) std::cerr << "Debug: Saving final version " << currentVersion << " with " << currentLogs.size() << " logs\n";
        
        JsonValue versionObj;
        versionObj["version"] = JsonValue(currentVersion);
        if(currentSubtitle.empty()) {
            versionObj["subtitle"] = JsonValue();
        } else {
            versionObj["subtitle"] = JsonValue(currentSubtitle);
        }
        
        JsonValue logsArr;
        logsArr.type = JsonType::Array;
        for (const auto& log : currentLogs) {
            logsArr.push_back(JsonValue(log));
        }
        versionObj["logs"] = logsArr;
        
        result.push_back(versionObj);
        versionCount++;
    }
    
    if (debug) std::cerr << "Debug: Total versions processed: " << versionCount << "\n";
    
    return result;
}

int main(int argc, char* argv[]) {
    if (argc < 5) {
        std::cerr << "Usage: " << argv[0] << " [--debug] -i PATH/TO/ORIGINAL/FILE.json -o OUTPUT_FILE_NAME.json\n";
        return 1;
    }
    
    std::string inputPath;
    std::string outputName;
    bool debug = false;
    
    for (int i = 1; i < argc; i++) {
        if (std::string(argv[i]) == "--debug") {
            debug = true;
        } else if (std::string(argv[i]) == "-i" && i + 1 < argc) {
            inputPath = argv[++i];
        } else if (std::string(argv[i]) == "-o" && i + 1 < argc) {
            outputName = argv[++i];
        }
    }
    
    if (inputPath.empty() || outputName.empty()) {
        std::cerr << "Usage: " << argv[0] << " [--debug] -i PATH/TO/ORIGINAL/FILE.json -o OUTPUT_FILE_NAME.json\n";
        return 1;
    }
    
    
    fs::path outputDir = "./.converter";
    if (!fs::exists(outputDir)) {
        fs::create_directories(outputDir);
    }
    
    fs::path outputPath = outputDir / outputName;
    
    
    std::ifstream inFile(inputPath, std::ios::binary);
    if (!inFile) {
        std::cerr << "Error: Cannot open input file: " << inputPath << "\n";
        return 1;
    }
    
    std::string jsonContent((std::istreambuf_iterator<char>(inFile)),
                            std::istreambuf_iterator<char>());
    inFile.close();
    
    
    JsonParser parser(jsonContent);
    JsonValue original = parser.parse();
    
    
    JsonValue converted = convertUpdateJson(original, debug);
    
    
    std::ofstream outFile(outputPath, std::ios::binary);
    if (!outFile) {
        std::cerr << "Error: Cannot create output file: " << outputPath << "\n";
        return 1;
    }
    
    serializeJson(outFile, converted);
    outFile << "\n";
    outFile.close();
    
    std::cout << "Converted: " << inputPath << " -> " << outputPath << "\n";
    std::cout << "Total versions: " << converted.arrayValue.size() << "\n";
    
    return 0;
}
