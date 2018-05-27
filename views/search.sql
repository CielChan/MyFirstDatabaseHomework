create view competitor_inform as
select  competitor.*, company.company_name from competitor join company on company.company_id=competitor.company_id