FROM httpd:2.4

RUN rm -r /usr/local/apache2/htdocs/* && rm /usr/local/apache2/conf/httpd.conf

COPY ./ /usr/local/apache2/htdocs

RUN mv /usr/local/apache2/htdocs/httpd.conf /usr/local/apache2/conf/
