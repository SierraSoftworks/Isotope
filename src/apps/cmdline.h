/* 
 * File:   cmdline.h
 * Author: Benjamin Pannell
 *
 * Created on 20 October 2014, 2:49 PM
 */

#ifndef CMDLINE_H
#define	CMDLINE_H

#ifdef	__cplusplus
extern "C" {
#endif

    void cmd_init(int argc, const char** argv);
    const char* cmd_application();
    int cmd_length();
    char cmd_hasFlag(const char shortFlag, const char* longFlag);
    char* cmd_getNextValue(int* position);
    

#ifdef	__cplusplus
}
#endif

#endif	/* CMDLINE_H */

