FROM nginx:alpine

# Copy static website files
COPY . /usr/share/nginx/html

# Copy custom Nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run default)
EXPOSE 8080
