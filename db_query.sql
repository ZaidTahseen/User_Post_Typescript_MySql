-- //////////////////////////////////////

CREATE TABLE `assignment`.`postlikes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `postid` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);



-- /////////////////////////////////////


CREATE TABLE `assignment`.`postdislikes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `postid` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE);



-- //////////////////////////////////////
select  content,title, count(*)  from  
postdislikes  join post on postdislikes.postid = post.id 
where title = 'Cricket'
group by content , title
;