#Scaling docker containers using docker compose 
we need nginx as load balancer for balancing the load on the containers 
we need to first build the image of the node_server so create Dockerfile no need to expose the the ports in this (as  we will be exposing nginx ports call will be made to load balancer that will forward it to the nodeserver container
so create my_conf.conf config file that listens to port 80 and proxies it to 
