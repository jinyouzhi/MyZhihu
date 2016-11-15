CREATE TABLE user (
  id INT(10) unsigned NOT NULL auto_increment,
  username VARCHAR(12) UNIQUE ,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY users_username_username_unique (username)
) engine = innodb;