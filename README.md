# 🚀 Jenkins + Node.js EC2 Pipeline Guide

## Quick Start

Use this for a fast setup on Ubuntu EC2:

```bash
sudo apt update && sudo apt install fontconfig openjdk-17-jre nodejs npm libatomic1 -y
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update && sudo apt-get install jenkins -y
sudo npm install -g pm2 && sudo systemctl enable --now jenkins
```

Then open:

```text
http://<YOUR_EC2_PUBLIC_IP>:8080
```

## 1) AWS EC2 Setup

Before running commands, prepare your EC2 instance:

- Launch an Ubuntu EC2 instance (Free Tier).
- Create and download a new key pair (`.pem`).
- In the Security Group inbound rules, allow:
  - `22` (SSH)
  - `8080` (Jenkins)
  - `3000` (Node API)

## 2) Server Installation (OS Level)

SSH into EC2 and run:

```bash
sudo apt update
sudo apt install fontconfig openjdk-17-jre -y
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
sudo apt-get update
sudo apt-get install jenkins -y
sudo apt-get install nodejs npm -y
sudo apt-get install libatomic1 -y
sudo npm install -g pm2
sudo systemctl enable jenkins
sudo systemctl start jenkins
```

## 3) Jenkins Configuration

Open Jenkins:

```text
http://<YOUR_EC2_PUBLIC_IP>:8080
```

Then:

- Get the initial admin password:

```bash
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

- Install suggested plugins.
- Go to **Manage Jenkins → Plugins → Available Plugins** and install **NodeJS Plugin**.
- Go to **Manage Jenkins → Tools**:
  - Scroll to **NodeJS installations**.
  - Click **Add NodeJS**.
  - Set name exactly as: `Nodejs`
  - Check **Install automatically**, then save.

## 4) Jenkins Pipeline Script

Create a new Pipeline job, enable GitHub trigger, and use:

```groovy
pipeline {
    agent any
    tools {
        nodejs 'Nodejs'
    }
    stages {
        stage('Check Node') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/poVvisal/appjs-on-jenkins.git'
            }
        }
        stage('Deploy API') {
            steps {
                sh 'npm install'
                sh 'pm2 restart my-api || pm2 start index.js --name my-api'
            }
        }
    }
}
```

## 5) GitHub Webhook

Set up webhook so every push triggers Jenkins:

- Go to **GitHub Repo → Settings → Webhooks → Add webhook**.
- Set Payload URL:

```text
http://<YOUR_EC2_PUBLIC_IP>:8080/github-webhook/
```

- Set Content type: `application/json`
- Click **Add webhook** and verify a green check mark.

## 6) Troubleshooting

- **`npm: not found` in Jenkins**
  - NodeJS tool name mismatch. It must match pipeline tools block exactly: `Nodejs`.

- **`exit code 127` / `libatomic.so.1` missing**
  - Install missing library:
  ```bash
  sudo apt-get install libatomic1 -y
  ```

- **Port `3000` already in use / old API process still running**
  - Use PM2 for process management and restart handling.