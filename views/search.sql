select * from competitor;

drop trigger perform;

DELIMITER $$
CREATE TRIGGER perform
    before INSERT ON performance
    FOR EACH ROW
BEGIN
    IF NEW.number not IN (SELECT number FROM competitor)
     THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = NEW.number;
  END IF;
END;$$

drop trigger performan_competitor