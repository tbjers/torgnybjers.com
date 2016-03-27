FROM xorcode/gulp-harp-nginx

WORKDIR /srv/www

ADD . /srv/www/
# Container needs to have these installed:
RUN npm link harp gulp gulp-shell gulp-cdnizer gulp-rev-all && \
  gulp cdn

EXPOSE 80

CMD ["nginx"]
