# Dockerfile para el servicio de productos
FROM eclipse-temurin:21-jdk-jammy 

ARG JAR_FILE=target/products-service-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app.jar"]