#!/bin/bash
cd /home/ec2-user/app-frontend
npm run build
pm2 start npm --name "givecredit" -- start
pm2 startup
pm2 save
pm2 restart all