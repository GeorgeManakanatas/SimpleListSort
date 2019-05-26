#!/bin/bash

################
# general info #
################

########################
# supporting functions #
########################

run_installation(){
	# installing git and ansible before running isntaller for the first time
	if ! command -v ansible >/dev/null; then
		echo "Installing Ansible dependencies and Git."
		if command -v yum >/dev/null; then
				sudo yum update -y
				sudo yum install git -y
				sudo yum install ansible -y
		elif command -v dnf >/dev/null; then
				sudo dnf update -y
				sudo dnf install git -y
				sudo dnf install ansible -y
		elif command -v apt-get >/dev/null; then
				sudo apt-get update -y
				sudo apt-get install git -y
				sudo apt-get install software-properties-common -y
				sudo apt-add-repository ppa:ansible/ansible -y
				sudo apt-get update -y
				sudo apt-get install ansible -y
		else
				echo "neither yum, dnf or apt-get found!"
				exit 1
		fi
	fi

	run_playbook "installation"

}

reset_postgresql(){
  # postgresql variables
  postgresContainerName="postgresql"
  postgresName="db"
  postgresUserName="user"
  postgresPassword="pass"
  postgresEnvironmentPort="5432"
  postgresContainerPort="5432"
  #
	sudo docker container stop $postgresContainerName ;
  sudo docker rm -f $postgresContainerName ;
  sudo docker run --name $postgresContainerName -e POSTGRESQL_USER=$postgresUserName -e POSTGRESQL_PASSWORD=$postgresPassword -e POSTGRESQL_DATABASE=$postgresName -p $postgresEnvironmentPort:$postgresContainerPort -d centos/postgresql-96-centos7 ;
}

run_playbook(){
	# realtive path to playbook MainPlaybook.yml file must be provided
	echo "Running $1 playbook."
	cd $1/
	ansible-playbook -K MainPlaybook.yml
	cd ..
}

notification(){
  # will display a notification with given text
  zenity --notification --window-icon="info" --text="$1" --timeout=2
}

start_GUI(){
  #zenity containers configuration
  IntallerTitle="	Intaller	"
  IntallerPrompt="Make your selection"
  IntallerWindowHeight=400
  #
  response=$(zenity --height="$IntallerWindowHeight" --list --checklist \
  	--title="$IntallerTitle" --column="" --column="$IntallerPrompt" \
    False "Install requirements" \
		False "Start Front End" \
		False "Start Back End" \
		False "Reset PostgreSQL container" \
  	--separator=':');

  # check for no selection
  if [ -z "$response" ] ; then
 	#spd-say "No selection exiting"
 	exit
  fi

  IFS=":" ; for word in $response ; do
	 	case $word in
	    	"Install requirements")
	      	run_installation
	      	notification "Requirements installed" ;;
				"Start Front End")
					cd FrontEnd/
					npm run start & 
					cd ..
					pwd
	      	notification "Frontend started" ;;
				"Start Back End")
					cd BackEnd/
					npm run start &
					cd ..
					pwd
	      	notification "Solid server started" ;;
				"Reset PostgreSQL container")
					reset_postgresql
	      	notification "PostgreSQL contaier restarted" ;;
	 	esac
  done
}

###################
# main gui window #
###################

while true; do
	start_GUI
done
