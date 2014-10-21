#include "cmdline.h"
#include <assert.h>
#include <stdio.h>

int main(int argc, const char** argv) {
    const char* arg;
    
    cmd_init(argc, argv);
    
    if(cmd_hasFlag('?', "help")) {
        printf("This is a quick test application for the cmdline library\n");
        return 0;
    }
    
    printf("Application: %s\n", cmd_application());
    
    printf("\nArguments:\n");
    while(arg = cmd_nextArgument())
        printf("  %s\n", arg);
    
    printf("\nFlags:\n");
    while(arg = cmd_nextFlag()) {
        printf("  %s\n", arg);
    }
    
    printf("\nValues:\n");
    while(arg = cmd_nextValue()) {
        printf("  %s\n", arg);
    }
    return 0;
}
