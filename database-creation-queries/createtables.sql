CREATE DATABASE [SimplyHealth]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'SimplyHealth', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESSBPA\MSSQL\DATA\SimplyHealth.mdf' , SIZE = 8192KB , FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'SimplyHealth_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESSBPA\MSSQL\DATA\SimplyHealth_log.ldf' , SIZE = 8192KB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [SimplyHealth] SET COMPATIBILITY_LEVEL = 150
GO
ALTER DATABASE [SimplyHealth] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [SimplyHealth] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [SimplyHealth] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [SimplyHealth] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [SimplyHealth] SET ARITHABORT OFF 
GO
ALTER DATABASE [SimplyHealth] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [SimplyHealth] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [SimplyHealth] SET AUTO_CREATE_STATISTICS ON(INCREMENTAL = OFF)
GO
ALTER DATABASE [SimplyHealth] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [SimplyHealth] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [SimplyHealth] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [SimplyHealth] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [SimplyHealth] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [SimplyHealth] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [SimplyHealth] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [SimplyHealth] SET  DISABLE_BROKER 
GO
ALTER DATABASE [SimplyHealth] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [SimplyHealth] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [SimplyHealth] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [SimplyHealth] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [SimplyHealth] SET  READ_WRITE 
GO
ALTER DATABASE [SimplyHealth] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [SimplyHealth] SET  MULTI_USER 
GO
ALTER DATABASE [SimplyHealth] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [SimplyHealth] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [SimplyHealth] SET DELAYED_DURABILITY = DISABLED 
GO
USE [SimplyHealth]
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = Off;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = Primary;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = On;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = Primary;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = Off;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = Primary;
GO
USE [SimplyHealth]
GO
IF NOT EXISTS (SELECT name FROM sys.filegroups WHERE is_default=1 AND name = N'PRIMARY') ALTER DATABASE [SimplyHealth] MODIFY FILEGROUP [PRIMARY] DEFAULT
GO






CREATE TABLE Companies
(CompanyID int IDENTITY(1,1),
CompanyName varchar(40)
CONSTRAINT PK_CompanyID PRIMARY KEY (CompanyID)
)


CREATE TABLE Teams 
(TeamName varchar(40)NOT NULL ,
CompanyID int NOT NULL ,
CONSTRAINT PK_Teams PRIMARY KEY (TeamName, CompanyID),
CONSTRAINT FK_Companies FOREIGN KEY (CompanyID)
REFERENCES Companies (CompanyID)
)

CREATE TABLE Users
(UserID int IDENTITY(1,1),
firstName varchar(25) NOT NULL,
lastName varchar(25) NOT NULL,
Username varchar(25) NOT NULL,
email varchar(60) NOT NULL ,
hashedpassword varchar(130) NOT NULL ,
TeamName varchar(40),
CompanyID int,
CONSTRAINT PK_UserID PRIMARY KEY (UserID),
CONSTRAINT FK_Team FOREIGN KEY (TeamName, CompanyID) REFERENCES Teams (TeamName, CompanyID)
)

CREATE TABLE CompanyActivities(
    CompanyID int NOT NULL, 
    ActivityID int IDENTITY(1,1),
    ActivityName varchar(30) NOT NULL,
    RepetitionsOrDuration int NOT NULL,
    Amount int NOT NULL,
    Completed BIT NOT NULL Default 'FALSE',
    ActivityDescription varchar(100),
    DateCreated DateTime,
    CONSTRAINT PK_CompanyActivites PRIMARY KEY (ActivityID),
    CONSTRAINT FK_CompanyID FOREIGN KEY (CompanyID) REFERENCES Companies (CompanyID),
)

CREATE TABLE TeamActivities(
    TeamName varchar(40) NOT NULL,
    CompanyID int NOT NULL,
    ActivityID int IDENTITY(1,1),
    ActivityName varchar(30) NOT NULL,
    RepetitionsOrDuration int NOT NULL,
    Amount int NOT NULL,
    Completed BIT NOT NULL Default 'FALSE',
    ActivityDescription varchar(100),
    CompanyActivityID int,
    DateCreated DateTime,
    CONSTRAINT PK_TeamActivites PRIMARY KEY (ActivityID),
    CONSTRAINT FK_TeamID FOREIGN KEY (TeamName, CompanyID) REFERENCES Teams (TeamName, CompanyID),
    CONSTRAINT FK_CompanyActivityID FOREIGN KEY (CompanyActivityID) REFERENCES CompanyActivities (ActivityID)
)



CREATE TABLE UserActivities(
    UserID int NOT NULL, 
    ActivityID int IDENTITY(1,1),
    ActivityName varchar(30) NOT NULL,
    RepetitionsOrDuration int NOT NULL,
    Amount int NOT NULL,
    Completed BIT NOT NULL Default 'FALSE',
    ActivityDescription varchar(100),
    TeamActivityID int,
    DateCreated DateTime,
    CONSTRAINT PK_UserActivites PRIMARY KEY (ActivityID),
    CONSTRAINT FK_UserID FOREIGN KEY (UserID) REFERENCES Users (UserID),
    CONSTRAINT FK_TeamActivityID FOREIGN KEY (TeamActivityID) REFERENCES TeamActivities (ActivityID)
)

ALTER TABLE Users
ADD isTeamLeader BIT Default 'False'

ALTER TABLE Users
ADD isCompanyLeader BIT Default 'False'

CREATE TABLE [dbo].[sessions](
    [sid] [nvarchar](255) NOT NULL PRIMARY KEY,
    [session] [nvarchar](max) NOT NULL,
    [expires] [datetime] NOT NULL
)
