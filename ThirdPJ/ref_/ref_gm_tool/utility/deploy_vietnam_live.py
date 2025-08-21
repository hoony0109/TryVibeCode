import sys
import os
import glob
import paramiko
from paramiko import SSHClient
from scp import SCPClient

isConfirm = input('are you sure you want to deploy for vietnam live (y/n)?\n')
if isConfirm.lower() != 'y':
    print('stopped deployment')
    sys.exit(1)

hostname = '103.69.192.42'
port = 28022
username = 'sg280'
password = 'lTzTv0ztAUZGFLw2URuu'

print('start deploy...\n')

# ssh connect
ssh = SSHClient()
# ssh.load_system_host_keys()
ssh.set_missing_host_key_policy(paramiko.WarningPolicy)
ssh.connect(hostname,port,username,password)
# SCPCLient takes a paramiko transport as an argument
scp = SCPClient(ssh.get_transport())
print('connecting server.......... Done!\n')

def sshExecCommand(command) :
    stdin, stdout, stderr = ssh.exec_command(command)
    while not stdout.channel.exit_status_ready() :
        for line in iter(stdout.readline,"") :
            print(line,end="")

# create directories
sshExecCommand('mkdir -p ~/docker/bs_crm')
sshExecCommand('chown -R ubuntu:ubuntu ~/docker/bs_crm')

# send create docker script
sshExecCommand('mkdir -p ~/docker/bs_crm/dockerfile')
scp.put('./utility/dockerfiles.sh', '~/docker/bs_crm/temp.sh')
sshExecCommand('tr -d \'\\r\' < ~/docker/bs_crm/temp.sh > ~/docker/bs_crm/create_bs_crm.sh')
sshExecCommand('rm ~/docker/bs_crm/temp.sh')
sshExecCommand('chmod -R 777 ~/docker/bs_crm/create_bs_crm.sh')
print('sending docker creation script.......... Done!\n')

# execute docker script
sshExecCommand('~/docker/bs_crm/create_bs_crm.sh ~/docker/bs_crm/dockerfile')
print('creating docker file.......... Done!\n')

# create or delete remote source files
sshExecCommand('mkdir -p ~/docker/bs_crm/dockerfile/app')
sshExecCommand('rm -rf ~/docker/bs_crm/dockerfile/app/*')
print('create remote path and deleting remote files .......... Done!\n')

# translate source files
directories = [d for d in glob.glob('./**',recursive=True) if os.path.isdir(d)]
for x in directories :
    if 'node_modules' not in x and 'log' not in x and 'configs' not in x and 'utility' not in x and 'build' not in x:
        files = [f for f in glob.glob(x +'/**') if os.path.isfile(f)]
        if '\\' in x:
            remotePath = x.replace('.\\','~/docker/bs_crm/dockerfile/app/')
            remotePath = remotePath.replace('\\','/')
        else:
            remotePath = x.replace('./','~/docker/bs_crm/dockerfile/app/')
        print('translating {}({}) to {}'.format(x, files, remotePath))
        sshExecCommand('mkdir -p ' + remotePath)
        scp.put( files, remote_path=remotePath )
        print('.......... Done!\n')

# translate config file
scp.put('./configs/config-vietnam-live.js', '~/docker/bs_crm/dockerfile/app/config.js')
print('translating config file .......... Done!\n')

# remove bs_crm container
sshExecCommand('cd ~/docker/bs_crm/dockerfile; ./remove_container.sh')
print('removing bs_crm container.......... Done!\n')

# build bs_crm docker
sshExecCommand('cd ~/docker/bs_crm/dockerfile; ./build_bs_crm.sh')
print('building bs_crm container.......... Done!\n')

# run bs_crm container
sshExecCommand('cd ~/docker/bs_crm/dockerfile; ./run_container.sh')
print('running bs_crm container.......... Done!\n')

# close
scp.close()
print('finished !!!\n')