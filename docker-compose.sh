is_docker_network_exists=`docker network inspect uniclient-network | jq length`

if [ "$is_docker_network_exists" -eq "0" ];
then 
  docker network create -d bridge --subnet=192.176.0.0/25 --gateway=192.176.0.1 uniclient-network
fi
docker compose up --build -d
sleep 10

docker exec -i app-redis bash  << EOF
redis-cli --cluster create 192.176.0.2:6379 192.176.0.3:6379 192.176.0.4:6379 \
192.176.0.5:6379 192.176.0.6:6379 192.176.0.7:6379 \
--cluster-replicas 1
yes
EOF
