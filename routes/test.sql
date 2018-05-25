DELIMITER $$
CREATE TRIGGER com_com
    BEFORE INSERT ON competitor
    FOR EACH ROW
BEGIN
    IF NEW.company NOT IN (SELECT name FROM company)
     THEN INSERT INTO company(name) VALUES (NEW.company);
  END IF;
END;$$
