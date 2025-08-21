
# Four Gods admin 
bs_crm build

1) npm install
2) npm run build
3) npm start

### Insallation
<pre>
cd /home
git clone https://github.com/c9soft/bs_crm
cd bs_crm
</pre>

### Run
<pre>
docker login
docker pull c9soft/bs_crm:react-web-app
docker run --restart always -it --name bs_crm -p 5050:3000 -v /var/log/bs_crm:/var/log/bs_crm -d c9soft/bs_crm:react-web-app
</pre>