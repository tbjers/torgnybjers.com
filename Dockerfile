FROM xorcode/gulp-harp-nginx

WORKDIR /srv/www

ADD . /srv/www/
RUN npm install gulp && gulp cdn

EXPOSE 80

CMD ["nginx"]
