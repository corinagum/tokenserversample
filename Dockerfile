FROM node:12
EXPOSE 80 2222

ADD scripts/init.sh /usr/local/bin/

# Setup OpenSSH for debugging thru Azure Web App
# https://docs.microsoft.com/en-us/azure/app-service/containers/app-service-linux-ssh-support#ssh-support-with-custom-docker-images
# https://docs.microsoft.com/en-us/azure/app-service/containers/tutorial-custom-docker-image
ENV SSH_PASSWD "root:Docker!"
ENV SSH_PORT 2222
RUN \
  apt-get update \
  && apt-get install -y --no-install-recommends dialog \
  && apt-get update \
  && apt-get install -y --no-install-recommends openssh-server \
  && echo "$SSH_PASSWD" | chpasswd \
  && chmod u+x /usr/local/bin/init.sh

ADD scripts/sshd_config /etc/ssh/

WORKDIR /var/web/

ENTRYPOINT init.sh

ADD . /var/web/

RUN npm ci

# docker tag ___ tss
#run, then remove: docker run -p 80:80 --rm -it tss