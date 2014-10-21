#include "cmdline.h"
#include <string.h>

const char** cmd_argv;
int cmd_argc;

void cmd_init(int argc, const char** argv) {
    cmd_argv = argv;
    cmd_argc = argc;
}

const char* cmd_application() {
    return cmd_argv[0];
}

int cmd_length() {
    return cmd_argc - 1;
}

char cmd_hasFlag(const char shortFlag, const char* longFlag) {
    int i;
    shortFlag = toupper(shortFlag);
    cmd_strupr(longFlag);

    for(i = 1; i < cmd_argc; i++) {
        if(shortFlag && cmd_argv[i][0] == '-' && toupper(cmd_argv[i][1]) == shortFlag && cmd_argv[i][2] == '\0') return 1;
        if(longFlag && !strncmp(cmd_argv[i], "--", 2) && !strcmp(cmd_strupr(cmd_argv[i] + 2), longFlag)) return 1;
    }
    return 0;
}

char* cmd_getNextValue(int* position) {
    for(; *position < cmd_argc; *position++) {
        if(cmd_argv[*position][0] != "-") return cmd_argv[*position];
    }
    *position = 0;
    return 0;
}

char* cmd_strupr(char* str) {
    char* s = str;
    do {
        *s = toupper(*s);
    } while(*(++s));
    return str;
}