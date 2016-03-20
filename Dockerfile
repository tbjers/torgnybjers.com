FROM xorcode/gulp-harp-nginx

WORKDIR /srv/www

ADD . /srv/www/
RUN gulp cdn

EXPOSE 80

CMD ["nginx"]
