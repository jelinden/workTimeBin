#!bin/bash
NODE_ENV=production nohup grunt > workhours.log 2>&1&
echo $! > worktimebin.pid
