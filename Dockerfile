FROM xorcode/gulp-harp-nginx

WORKDIR /srv/www

ADD . /srv/www/
RUN npm link harp gulp gulp-shell gulp-cdnizer && gulp cdn

EXPOSE 80

CMD ["nginx"]
