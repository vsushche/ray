#!/bin/bash
tmux new-session -d 'ssh -t root@ua-tl-u005 "cd ~/ray; $SHELL"'
tmux split-window 'ssh -t root@ua-tl-u006 "cd ~/ray; $SHELL"'
tmux split-window 'ssh -t root@ua-tl-u007 "cd ~/ray; $SHELL"'
tmux split-window 'ssh -t root@ua-tl-u008 "cd ~/ray; $SHELL"'
tmux set-window-option main-pane-height 15
tmux select-layout tiled
tmux split-window -t 0 'ssh -t root@ua-tl-u005 "cd ~/ray; $SHELL"'
tmux attach
