create user postgres with password '123456';
create database idecs owner postgres;
grant all privileges on database idecs to postgres;
