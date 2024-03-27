
docker login --username=httpxyc registry.cn-shenzhen.aliyuncs.com --password=Xycexe.,
docker build --platform linux/amd64 -t registry.cn-shenzhen.aliyuncs.com/httpxyc/test1:0.0.1 .
docker push registry.cn-shenzhen.aliyuncs.com/httpxyc/test1:0.0.1


# aliyun docker
docker pull registry.cn-shenzhen.aliyuncs.com/httpxyc/test1:0.0.1
docker run --name aliyun-container -p 8080:80 -d registry.cn-shenzhen.aliyuncs.com/httpxyc/test1:0.0.1