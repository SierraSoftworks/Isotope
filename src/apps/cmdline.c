#include "cmdline.h"
#include <string.h>
#include <stdlib.h>

const char** cmd_argv;
int cmd_argc;
int cmd_parsePosition_value = 1;
int cmd_parsePosition_flag = 1;

void cmd_init(int argc, const char** argv) {
    int i;

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

char cmd_hasFlag(char shortFlag, const char* longFlag) {
    int i;
    char *upLongFlag;
    shortFlag = toupper(shortFlag);
    if(longFlag) upLongFlag = cmd_strupr(longFlag);

    for(i = 1; i < cmd_argc; i++) {
        if(shortFlag && cmd_argv[i][0] == '-' && cmd_argv[i][1] == shortFlag && cmd_argv[i][2] == '\0') {
            free(upLongFlag);
            return 1;
        }
        if(longFlag && !strncmp(cmd_argv[i], "--", 2) && !strcmp(cmd_argv[i] + 2, upLongFlag)) {
            free(upLongFlag);
            return 1;
        }
    }
    free(upLongFlag);
    return 0;
}

const char* cmd_nextValue() {
    for(; cmd_parsePosition_value < cmd_argc;cmd_parsePosition_value++) {
        if(cmd_argv[cmd_parsePosition_value][0] != '-') return cmd_argv[cmd_parsePosition_value++];
    }
    return 0;
}

const char* cmd_nextFlag() {
    for(; cmd_parsePosition_flag < cmd_argc;cmd_parsePosition_flag++) {
        if(cmd_argv[cmd_parsePosition_flag][0] != '-') continue;
        if(cmd_argv[cmd_parsePosition_flag][1] == '-') return &cmd_argv[cmd_parsePosition_flag++][2];
        return &cmd_argv[cmd_parsePosition_flag++][1];
    }
    return 0;
}

char* cmd_strupr(const char* str) {
    int strLength;
    char* s, *target;
    strLength = strlen(str) + 1;
    target = s = (char*)malloc(strLength * sizeof(char));
    while(*str) {
        *(s++) = toupper(*str++);
    }
    *s = 0;
    return target;
}