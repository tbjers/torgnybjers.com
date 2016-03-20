FROM xorcode/gulp-harp-nginx

WORKDIR /srv/www

ADD . /srv/www/
RUN npm install gulp harp && gulp cdn

EXPOSE 80

CMD ["nginx"]
