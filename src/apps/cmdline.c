#include "cmdline.h"
#include <string.h>
#include <stdlib.h>

const char** cmd_argv;
int cmd_argc;

void cmd_init(int argc, const char** argv) {
    int i, len;

    cmd_argv = (const char**)malloc(argc * sizeof(char*));
    cmd_argc = argc;

    for(i = 0; i < argc; i++) {
        if(argv[i][0] == '-') {
            cmd_argv[i] = cmd_strupr(argv[i]);
        } else {
            cmd_argv[i] = argv[i];
        }
    }
}

const char* cmd_application() {
    return cmd_argv[0];
}

int cmd_length() {
    return cmd_argc - 1;
}

char cmd_hasFlag(char shortFlag, char* longFlag) {
    int i;
    shortFlag = toupper(shortFlag);
    cmd_strupr(longFlag);

    for(i = 1; i < cmd_argc; i++) {
        if(shortFlag && cmd_argv[i][0] == '-' && cmd_argv[i][1] == shortFlag && cmd_argv[i][2] == '\0') return 1;
        if(longFlag && !strncmp(cmd_argv[i], "--", 2) && !strcmp(cmd_argv[i] + 2, longFlag)) return 1;
    }
    return 0;
}

const char* cmd_getNextValue(int* position) {
    for(; *position < cmd_argc; *position++) {
        if(cmd_argv[*position][0] != '-') return cmd_argv[*position];
    }
    *position = 1;
    return 0;
}

const char* cmd_strupr(const char* str) {
    int strLength;
    char* s;
    strLength = strlen(str) + 1;
    s = (char*)malloc(strLength * sizeof(char));
    do {
        *(s++) = toupper(*str);
    } while(*(++str));
    *s = 0;
    return s;
}