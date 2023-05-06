﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using WMS.Database;

#nullable disable

namespace WMS.Database.Migrations
{
    [DbContext(typeof(WmsDbContext))]
    partial class WmsDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("WMS.Database.Entities.Addresses.Address", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("AreaId")
                        .HasColumnType("int");

                    b.Property<int?>("ShelfId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AreaId");

                    b.HasIndex("ShelfId")
                        .IsUnique()
                        .HasFilter("[ShelfId] IS NOT NULL");

                    b.ToTable("Addresses");
                });

            modelBuilder.Entity("WMS.Database.Entities.Addresses.Area", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("MaxShelfs")
                        .HasColumnType("int");

                    b.Property<int>("MaxVerticalSections")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("Name")
                        .IsUnique();

                    b.ToTable("Areas");
                });

            modelBuilder.Entity("WMS.Database.Entities.Addresses.Rack", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("AreaId")
                        .HasColumnType("int");

                    b.Property<int>("Index")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AreaId");

                    b.HasIndex("Index", "AreaId")
                        .IsUnique();

                    b.ToTable("Racks");
                });

            modelBuilder.Entity("WMS.Database.Entities.Addresses.Shelf", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("Index")
                        .HasColumnType("int");

                    b.Property<int>("VerticalSectionId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("VerticalSectionId");

                    b.HasIndex("Index", "VerticalSectionId")
                        .IsUnique();

                    b.ToTable("Shelfs");
                });

            modelBuilder.Entity("WMS.Database.Entities.Addresses.VerticalSection", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int>("Index")
                        .HasColumnType("int");

                    b.Property<int>("RackId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("RackId");

                    b.HasIndex("Index", "RackId")
                        .IsUnique();

                    b.ToTable("VerticalSections");
                });

            modelBuilder.Entity("WMS.Database.Entities.Comment", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<DateTimeOffset>("CreatedDate")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Message")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OwnerId")
                        .HasColumnType("int");

                    b.Property<int>("ProblemId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.HasIndex("ProblemId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("WMS.Database.Entities.Dictionaries.UnitOfMeasurement", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("UnitsOfMeasurement");
                });

            modelBuilder.Entity("WMS.Database.Entities.Problem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int?>("AuditorId")
                        .HasColumnType("int");

                    b.Property<int>("AuthorId")
                        .HasColumnType("int");

                    b.Property<DateTimeOffset>("CreatedDate")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetimeoffset");

                    b.Property<DateTimeOffset?>("DeadlineDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTimeOffset?>("LastUpdateDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<int?>("ParentProblemId")
                        .HasColumnType("int");

                    b.Property<int?>("PerformerId")
                        .HasColumnType("int");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<int?>("TargetAddressId")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("WareId")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AuditorId");

                    b.HasIndex("AuthorId");

                    b.HasIndex("ParentProblemId");

                    b.HasIndex("PerformerId");

                    b.HasIndex("TargetAddressId");

                    b.HasIndex("WareId");

                    b.ToTable("Problems");
                });

            modelBuilder.Entity("WMS.Database.Entities.Setting", b =>
                {
                    b.Property<string>("Key")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Value")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Key");

                    b.ToTable("Settings");

                    b.HasData(
                        new
                        {
                            Key = "ProblemExpirationNotificationDays",
                            Value = "1"
                        },
                        new
                        {
                            Key = "ShippedWaresStorageDays",
                            Value = "1"
                        });
                });

            modelBuilder.Entity("WMS.Database.Entities.Tenants.Individual", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PassportNumber")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("SurName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("PassportNumber")
                        .IsUnique();

                    b.ToTable("Individuals");
                });

            modelBuilder.Entity("WMS.Database.Entities.Tenants.LegalEntity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Phone")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<string>("UNN")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.HasKey("Id");

                    b.HasIndex("UNN")
                        .IsUnique();

                    b.ToTable("LegalEntities");
                });

            modelBuilder.Entity("WMS.Database.Entities.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<string>("AvatarUrl")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RefreshToken")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("RefreshTokenSalt")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Role")
                        .HasColumnType("int");

                    b.Property<string>("Salt")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("Email")
                        .IsUnique();

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            Email = "system.wms@outlook.com",
                            FirstName = "Vladislav",
                            LastName = "Demyanov",
                            Password = "F1486D74197BD91710B65408BF017EDF18F66373919DBA7207683B8ECCB86C6A",
                            Role = 0,
                            Salt = "D45DAEBA2226F2F374F80D19F79413DC"
                        });
                });

            modelBuilder.Entity("WMS.Database.Entities.Ware", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"), 1L, 1);

                    b.Property<int?>("AddressId")
                        .HasColumnType("int");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ImagePath")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int?>("IndividualId")
                        .HasColumnType("int");

                    b.Property<int?>("LegalEntityId")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTimeOffset>("ReceivingDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<DateTimeOffset?>("ShippingDate")
                        .HasColumnType("datetimeoffset");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("AddressId")
                        .IsUnique()
                        .HasFilter("[AddressId] IS NOT NULL");

                    b.HasIndex("IndividualId");

                    b.HasIndex("LegalEntityId");

                    b.ToTable("Wares");
                });

            modelBuilder.Entity("WMS.Database.Entities.Addresses.Address", b =>
                {
                    b.HasOne("WMS.Database.Entities.Addresses.Area", "Area")
                        .WithMany()
                        .HasForeignKey("AreaId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("WMS.Database.Entities.Addresses.Shelf", "Shelf")
                        .WithOne("Address")
                        .HasForeignKey("WMS.Database.Entities.Addresses.Address", "ShelfId")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.Navigation("Area");

                    b.Navigation("Shelf");
                });

            modelBuilder.Entity("WMS.Database.Entities.Addresses.Rack", b =>
                {
                    b.HasOne("WMS.Database.Entities.Addresses.Area", "Area")
                        .WithMany("Racks")
                        .HasForeignKey("AreaId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Area");
                });

            modelBuilder.Entity("WMS.Database.Entities.Addresses.Shelf", b =>
                {
                    b.HasOne("WMS.Database.Entities.Addresses.VerticalSection", "VerticalSection")
                        .WithMany("Shelfs")
                        .HasForeignKey("VerticalSectionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("VerticalSection");
                });

            modelBuilder.Entity("WMS.Database.Entities.Addresses.VerticalSection", b =>
                {
                    b.HasOne("WMS.Database.Entities.Addresses.Rack", "Rack")
                        .WithMany("VerticalSections")
                        .HasForeignKey("RackId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Rack");
                });

            modelBuilder.Entity("WMS.Database.Entities.Comment", b =>
                {
                    b.HasOne("WMS.Database.Entities.User", "Owner")
                        .WithMany("Comments")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("WMS.Database.Entities.Problem", "Problem")
                        .WithMany("Comments")
                        .HasForeignKey("ProblemId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Owner");

                    b.Navigation("Problem");
                });

            modelBuilder.Entity("WMS.Database.Entities.Problem", b =>
                {
                    b.HasOne("WMS.Database.Entities.User", "Auditor")
                        .WithMany("AuditorProblems")
                        .HasForeignKey("AuditorId")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.HasOne("WMS.Database.Entities.User", "Author")
                        .WithMany("AuthorProblems")
                        .HasForeignKey("AuthorId")
                        .OnDelete(DeleteBehavior.NoAction)
                        .IsRequired();

                    b.HasOne("WMS.Database.Entities.Problem", "ParentProblem")
                        .WithMany("ChildrenProblems")
                        .HasForeignKey("ParentProblemId")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.HasOne("WMS.Database.Entities.User", "Performer")
                        .WithMany("PerformerProblems")
                        .HasForeignKey("PerformerId")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.HasOne("WMS.Database.Entities.Addresses.Address", "TargetAddress")
                        .WithMany("Problems")
                        .HasForeignKey("TargetAddressId");

                    b.HasOne("WMS.Database.Entities.Ware", "Ware")
                        .WithMany("Problems")
                        .HasForeignKey("WareId");

                    b.Navigation("Auditor");

                    b.Navigation("Author");

                    b.Navigation("ParentProblem");

                    b.Navigation("Performer");

                    b.Navigation("TargetAddress");

                    b.Navigation("Ware");
                });

            modelBuilder.Entity("WMS.Database.Entities.Ware", b =>
                {
                    b.HasOne("WMS.Database.Entities.Addresses.Address", "Address")
                        .WithOne("Ware")
                        .HasForeignKey("WMS.Database.Entities.Ware", "AddressId")
                        .OnDelete(DeleteBehavior.NoAction);

                    b.HasOne("WMS.Database.Entities.Tenants.Individual", "Individual")
                        .WithMany("Wares")
                        .HasForeignKey("IndividualId");

                    b.HasOne("WMS.Database.Entities.Tenants.LegalEntity", "LegalEntity")
                        .WithMany("Wares")
                        .HasForeignKey("LegalEntityId");

                    b.Navigation("Address");

                    b.Navigation("Individual");

                    b.Navigation("LegalEntity");
                });

            modelBuilder.Entity("WMS.Database.Entities.Addresses.Address", b =>
                {
                    b.Navigation("Problems");

                    b.Navigation("Ware")
                        .IsRequired();
                });

            modelBuilder.Entity("WMS.Database.Entities.Addresses.Area", b =>
                {
                    b.Navigation("Racks");
                });

            modelBuilder.Entity("WMS.Database.Entities.Addresses.Rack", b =>
                {
                    b.Navigation("VerticalSections");
                });

            modelBuilder.Entity("WMS.Database.Entities.Addresses.Shelf", b =>
                {
                    b.Navigation("Address");
                });

            modelBuilder.Entity("WMS.Database.Entities.Addresses.VerticalSection", b =>
                {
                    b.Navigation("Shelfs");
                });

            modelBuilder.Entity("WMS.Database.Entities.Problem", b =>
                {
                    b.Navigation("ChildrenProblems");

                    b.Navigation("Comments");
                });

            modelBuilder.Entity("WMS.Database.Entities.Tenants.Individual", b =>
                {
                    b.Navigation("Wares");
                });

            modelBuilder.Entity("WMS.Database.Entities.Tenants.LegalEntity", b =>
                {
                    b.Navigation("Wares");
                });

            modelBuilder.Entity("WMS.Database.Entities.User", b =>
                {
                    b.Navigation("AuditorProblems");

                    b.Navigation("AuthorProblems");

                    b.Navigation("Comments");

                    b.Navigation("PerformerProblems");
                });

            modelBuilder.Entity("WMS.Database.Entities.Ware", b =>
                {
                    b.Navigation("Problems");
                });
#pragma warning restore 612, 618
        }
    }
}
