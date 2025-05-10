# Self-Hosted Agent Setup Guide

This guide explains how to set up self-hosted agents for the Marrakech Transport System project. These agents will be used by both Azure DevOps and GitHub Actions CI/CD pipelines.

## Prerequisites

- A dedicated machine or VM with:
  - At least 4 CPU cores
  - 8+ GB RAM
  - 100+ GB storage
  - Ubuntu 20.04 LTS or later
  - Network access to GitHub, Azure DevOps, and Docker Hub
- Administrative privileges on the machine

## Azure DevOps Agent Setup

### 1. Create a Personal Access Token (PAT)

1. Sign in to your Azure DevOps organization
2. Go to User Settings > Personal Access Tokens
3. Create a new token with the "Agent Pools (read, manage)" scope
4. Save the token securely - you'll need it during agent setup

### 2. Install the Agent

```bash
# Create a directory for the agent
mkdir -p ~/agent/default && cd ~/agent/default

# Download the agent package
curl -O https://vstsagentpackage.azureedge.net/agent/3.238.1/vsts-agent-linux-x64-3.238.1.tar.gz

# Extract the package
tar zxvf vsts-agent-linux-x64-3.238.1.tar.gz

# Configure the agent
./config.sh
```

During configuration, you'll be prompted for:
- Server URL: Your Azure DevOps organization URL
- Authentication type: PAT
- PAT: Enter the token created earlier
- Agent pool: "Default"
- Agent name: Provide a unique name (e.g., default-agent-1)

### 3. Install Required Dependencies

```bash
# Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
sudo npm install -g pnpm

# Install Kubernetes CLI
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install necessary libraries
sudo apt-get install -y build-essential libssl-dev libffi-dev python3-dev
```

### 4. Run the Agent

```bash
# Run as a service
sudo ./svc.sh install
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

## GitHub Actions Runner Setup

### 1. Generate a Runner Registration Token

1. Navigate to your GitHub repository
2. Go to Settings > Actions > Runners
3. Click "New self-hosted runner"
4. Note the registration token (valid for 1 hour)

### 2. Install the Runner

```bash
# Create a directory for the runner
mkdir -p ~/actions-runner && cd ~/actions-runner

# Download the runner package
curl -o actions-runner-linux-x64-2.314.1.tar.gz -L https://github.com/actions/runner/releases/download/v2.314.1/actions-runner-linux-x64-2.314.1.tar.gz

# Extract the installer
tar xzf ./actions-runner-linux-x64-2.314.1.tar.gz

# Configure the runner
./config.sh --url https://github.com/your-organization/system-transport --token YOUR_REGISTRATION_TOKEN --labels Default
```

### 3. Install the Same Dependencies

Follow the same dependency installation steps from the Azure DevOps agent setup.

### 4. Run the Runner as a Service

```bash
# Install and start the service
sudo ./svc.sh install
sudo ./svc.sh start

# Check status
sudo ./svc.sh status
```

## Maintenance

### Updating Agents

For Azure DevOps agents:
```bash
cd ~/agent/default
./config.sh remove --auth pat --token YOUR_PAT
# Download and configure the new version
```

For GitHub Actions runners:
```bash
cd ~/actions-runner
./config.sh remove --token YOUR_REMOVAL_TOKEN
# Download and configure the new version
```

### Monitoring

Set up a simple monitoring solution to ensure agents are running:

```bash
# Create a monitoring script
cat > /home/agent/monitor-agents.sh << 'EOF'
#!/bin/bash

check_service() {
  if ! systemctl is-active --quiet "$1"; then
    echo "$1 is not running, restarting..."
    sudo systemctl restart "$1"
    echo "$1 restarted at $(date)" >> /home/agent/agent-restarts.log
  fi
}

check_service vsts.agent.*.default.service
check_service actions.runner.*.service
EOF

# Make the script executable
chmod +x /home/agent/monitor-agents.sh

# Add to crontab to run every 5 minutes
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/agent/monitor-agents.sh") | crontab -
```

## Security Considerations

- Run agents with the principle of least privilege
- Regularly update the agent software and dependencies
- Use dedicated service accounts for agent operations
- Isolate agent networks from production environments where possible
- Rotate PATs and registration tokens regularly 