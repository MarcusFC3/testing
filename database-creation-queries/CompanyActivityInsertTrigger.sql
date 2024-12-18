CREATE TRIGGER [createCompanyActivitiesForTeams]
ON CompanyActivities
AFTER INSERT
AS 
BEGIN 
	Declare @CompanyID int
	SELECT @CompanyID = CompanyID FROM inserted
	Declare	@ActivityID int 
	SELECT @ActivityID = ActivityID FROM inserted
	Declare @name varchar(30)
	SELECT @name = ActivityName FROM inserted
	Declare @reps int
	SELECT @reps = RepetitionsOrDuration FROM inserted
	Declare @amount int
	SELECT @amount = amount FROM inserted
	Declare @ActivityDescription varchar(100)
	SELECT @ActivityDescription = ActivityDescription FROM inserted
	Declare @Date Date
	SELECT @Date FROM inserted



	declare @CompanyMemberstable table
	(
	TeamName varchar(40), 
    ActivityName varchar(30),
	RepetitionsOrDuration int ,
	Amount int,
	ActivityDescription varchar(100),
	CompanyActivityID int,
	DateCreated Date,
	CompanyID int)

	INSERT INTO @CompanyMemberstable(TeamName)
	SELECT TeamName FROM Teams Where CompanyID = @CompanyID


	UPDATE @CompanyMemberstable
	SET
	ActivityName = @name,
	RepetitionsOrDuration = @reps,
	Amount = @amount,
	ActivityDescription = @ActivityDescription,
	CompanyActivityID = @ActivityID,
	DateCreated = @Date,
	CompanyID = @CompanyID
	

	INSERT INTO TeamActivities (TeamName, CompanyID, ActivityName, RepetitionsOrDuration, Amount, ActivityDescription, CompanyActivityID, DateCreated)
	SELECT TeamName, CompanyID, ActivityName, RepetitionsOrDuration, Amount, ActivityDescription, CompanyActivityID, DateCreated FROM @CompanyMemberstable
	
END
 
 
Create TRIGGER [dbo].[createTeamActivitiesForUsers]
ON [dbo].[TeamActivities]
AFTER INSERT
AS 
BEGIN 
	Declare @TeamName varchar(40)
	Declare @CompanyID int
	Declare	@ActivityID int 
	Declare @name varchar(30)
	Declare @reps int
	Declare @amount int
	Declare @Date Date
	Declare @ActivityDescription varchar(100)
	SELECT @TeamName = TeamName, @CompanyID = CompanyID,  @ActivityID = ActivityID,  @name = ActivityName,  @reps = RepetitionsOrDuration,
	@amount = amount, @ActivityDescription = ActivityDescription, @Date = [DateCreated] FROM inserted


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
	SELECT UserID FROM Users Where TeamName = @TeamName AND CompanyID = @CompanyID 
	
	UPDATE @TeamMemberstable
	SET
	ActivityName = @name,
	RepetitionsOrDuration = @reps,
	Amount = @amount,
	ActivityDescription = @ActivityDescription,
	TeamActivityID = @ActivityID,
	DateCreated = @Date


	INSERT INTO UserActivities (UserID, ActivityName, RepetitionsOrDuration, Amount, ActivityDescription, TeamActivityID, DateCreated)
	SELECT UserID, ActivityName, RepetitionsOrDuration, Amount, ActivityDescription,  TeamActivityID, DateCreated FROM @TeamMemberstable
	

END
 