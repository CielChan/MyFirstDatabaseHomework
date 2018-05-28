DELIMITER $$
create function get_id(name varchar(10))
returns int
begin
declare id int;
if name not in(select company_name from company)
then insert into company (company_name) values(name);
end if;
select company_id into id from company where company_name=name;
return id;
end;$$