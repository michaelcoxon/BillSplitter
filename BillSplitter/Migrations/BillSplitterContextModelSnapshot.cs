﻿// <auto-generated />
using BillSplitter.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace BillSplitter.Migrations
{
    [DbContext(typeof(BillSplitterContext))]
    partial class BillSplitterContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.3-rtm-10026");

            modelBuilder.Entity("BillSplitter.Models.Bill", b =>
                {
                    b.Property<int>("BillId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("BillCollectionId");

                    b.Property<DateTime>("BillDate");

                    b.Property<string>("Comment");

                    b.Property<int>("PersonId");

                    b.Property<int>("SupplierId");

                    b.Property<double>("TotalAmount");

                    b.HasKey("BillId");

                    b.HasIndex("BillCollectionId");

                    b.HasIndex("SupplierId");

                    b.HasIndex("BillId", "BillCollectionId")
                        .IsUnique();

                    b.ToTable("Bills");
                });

            modelBuilder.Entity("BillSplitter.Models.BillCollection", b =>
                {
                    b.Property<int>("BillCollectionId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("Date");

                    b.HasKey("BillCollectionId");

                    b.ToTable("BillCollections");
                });

            modelBuilder.Entity("BillSplitter.Models.Payment", b =>
                {
                    b.Property<int>("PaymentId")
                        .ValueGeneratedOnAdd();

                    b.Property<double>("Amount");

                    b.Property<DateTime>("Date");

                    b.Property<int>("ReceiverPersonId");

                    b.Property<int>("SenderPersonId");

                    b.HasKey("PaymentId");

                    b.HasIndex("ReceiverPersonId");

                    b.HasIndex("SenderPersonId");

                    b.ToTable("Payments");
                });

            modelBuilder.Entity("BillSplitter.Models.Person", b =>
                {
                    b.Property<int>("PersonId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("PersonId");

                    b.ToTable("Persons");
                });

            modelBuilder.Entity("BillSplitter.Models.Split", b =>
                {
                    b.Property<int>("BillId");

                    b.Property<int>("BillCollectionId");

                    b.Property<int>("PersonId");

                    b.Property<double?>("SplitAmount");

                    b.Property<double?>("SplitPercent");

                    b.HasKey("BillId", "BillCollectionId", "PersonId");

                    b.HasIndex("PersonId");

                    b.ToTable("Splits");
                });

            modelBuilder.Entity("BillSplitter.Models.Supplier", b =>
                {
                    b.Property<int>("SupplierId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name");

                    b.HasKey("SupplierId");

                    b.ToTable("Suppliers");
                });

            modelBuilder.Entity("BillSplitter.Models.Bill", b =>
                {
                    b.HasOne("BillSplitter.Models.BillCollection")
                        .WithMany("Bills")
                        .HasForeignKey("BillCollectionId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BillSplitter.Models.Supplier")
                        .WithMany("Bills")
                        .HasForeignKey("SupplierId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BillSplitter.Models.Payment", b =>
                {
                    b.HasOne("BillSplitter.Models.Person", "ReceiverPerson")
                        .WithMany()
                        .HasForeignKey("ReceiverPersonId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BillSplitter.Models.Person", "SenderPerson")
                        .WithMany("Payments")
                        .HasForeignKey("SenderPersonId")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("BillSplitter.Models.Split", b =>
                {
                    b.HasOne("BillSplitter.Models.Bill")
                        .WithMany("Splits")
                        .HasForeignKey("BillId")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("BillSplitter.Models.Person")
                        .WithMany("Splits")
                        .HasForeignKey("PersonId")
                        .OnDelete(DeleteBehavior.Cascade);
                });
#pragma warning restore 612, 618
        }
    }
}
