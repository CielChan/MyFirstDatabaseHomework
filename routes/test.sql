DELIMITER $$
CREATE TRIGGER performan_competitor
    AFTER INSERT ON competitor
    FOR EACH ROW
BEGIN
    IF NEW.number NOT IN (SELECT number FROM performance)
     THEN INSERT INTO performance(number) VALUES (NEW.number);
  END IF;
END;$$


DELIMITER $$
create function get_id(name varchar(100))
returns int
begin
declare id int;
if name not in(select company_name from company)
then insert into company (company_name) values(name);
end if;
select company_id into id from company where company_name=name;
return id;
end;$$




create view competitor_inform as
select  competitor.*, company.company_name from competitor join company on company.company_id=competitor.company_id
