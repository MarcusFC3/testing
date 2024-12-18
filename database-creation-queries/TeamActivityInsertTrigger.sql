


GO
CREATE TRIGGER [createTeamActivitiesForUsers]
ON TeamActivities
AFTER INSERT
AS 
BEGIN 
	Declare @TeamID int
	SELECT @TeamID = TeamID FROM inserted
	Declare @name varchar(30)
	SELECT @name = ActivityName FROM inserted
	Declare	@ActivityID int 
	SELECT @ActivityID = ActivityID FROM inserted
	Declare @reps int
	SELECT @reps = RepetitionsOrDuration FROM inserted
	Declare @amount int
	SELECT @amount = amount FROM inserted
	Declare @ActivityDescription varchar(100)
	SELECT @ActivityDescription = ActivityDescription FROM inserted
	Declare @Date Date
	SELECT @Date = DateCreated FROM inserted


	declare @TeamMemberstable table
	(
	UserID int, 
    ActivityName varchar(30),
	RepetitionsOrDuration int ,
	Amount int,
	ActivityDescription varchar(100),
	TeamActivityID int,
	DateCreated Date)

	INSERT INTO @TeamMemberstable(UserID)
	SELECT UserID FROM Users Where TeamID = @TeamID


	UPDATE @TeamMemberstable
	SET
	ActivityName = @name,
	RepetitionsOrDuration = @reps,
	Amount = @amount,
	ActivityDescription = @ActivityDescription,
	TeamActivityID = @ActivityID,
	DateCreated = @Date

	INSERT INTO UserActivities (UserID,ActivityName, RepetitionsOrDuration, Amount, ActivityDescription, TeamActivityID, DateCreated)
	SELECT UserID,ActivityName, RepetitionsOrDuration, Amount, ActivityDescription, TeamActivityID, DateCreated FROM @TeamMemberstable

END