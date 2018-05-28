DELIMITER $$
CREATE TRIGGER performan_competitor
    AFTER INSERT ON competitor
    FOR EACH ROW
BEGIN
    IF NEW.number NOT IN (SELECT number FROM performance)
     THEN INSERT INTO performance(number) VALUES (NEW.number);
     update performance set ranking='A' where number=new.number
  END IF;
END;$$

DELIMITER $$
CREATE TRIGGER perform
    before INSERT ON performance
    FOR EACH ROW
BEGIN
    IF NEW.number not IN (SELECT number FROM competitor)
     THEN INSERT INTO performance(number,position,ranking) VALUES (NEW.number,new.position,new.ranking);
  END IF;
END;$$

DELIMITER $$
create function get_id(name varchar(10))
returns int
begin
declare id int;
if name not in(select company_name from company) and name<>NULL
then insert into company (company_name) values(name);
end if;
select company_id into id from company where company_name=name;
return id;
end;$$





create view competitor_inform as
select  competitor.*, company.company_name from competitor join company on company.company_id=competitor.company_id

create view competitor_lis as
select competitor_inform.*,ranking from competitor_inform join performance on competitor_inform.number=performance.number
