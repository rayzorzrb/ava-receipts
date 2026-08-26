import SwiftUI

struct RootView: View {
    @EnvironmentObject private var store: AvaStore
    @State private var showAdd = false

    var body: some View {
        TabView {
            NavigationStack {
                HomeView()
                    .navigationTitle("august")
                    .navigationBarTitleDisplayMode(.large)
                    .toolbar {
                        ToolbarItem(placement: .topBarLeading) {
                            Text("ava").font(.headline)
                        }
                        ToolbarItem(placement: .primaryAction) {
                            Button {
                                showAdd = true
                            } label: {
                                Image(systemName: "plus")
                            }
                            .accessibilityLabel("New receipt")
                        }
                    }
            }
            .tabItem { Label("Home", systemImage: "house.fill") }

            NavigationStack {
                BoxesView()
                    .navigationTitle("Boxes")
                    .navigationBarTitleDisplayMode(.large)
            }
            .tabItem { Label("Boxes", systemImage: "square.grid.2x2.fill") }
        }
        .sheet(isPresented: $showAdd) {
            AddSheet { receipt in
                store.add(receipt)
                showAdd = false
            }
        }
    }
}

struct HomeView: View {
    @EnvironmentObject private var store: AvaStore
    @State private var selected: Receipt?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                Text("\(store.receipts.count) receipts in the drawer")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .padding(.horizontal, 20)

                DrawerView(receipts: store.receipts) { selected = $0 }
                    .padding(.horizontal, 8)

                Text("The Boxes")
                    .font(.title3.weight(.semibold))
                    .padding(.horizontal, 20)
                    .padding(.top, 8)

                LazyVGrid(columns: [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)], spacing: 16) {
                    ForEach(AvaCategory.allCases.filter { $0 != .other }) { cat in
                        NavigationLink {
                            CategoryView(category: cat)
                        } label: {
                            VStack(alignment: .leading, spacing: 6) {
                                DrawerView(receipts: Array(store.inCategory(cat).prefix(3))) { selected = $0 }
                                Text(cat.label)
                                    .font(.subheadline.weight(.semibold))
                                    .foregroundStyle(.primary)
                                Text(String(format: "₹%.2f ×%d", store.total(cat), store.inCategory(cat).count))
                                    .font(.footnote)
                                    .foregroundStyle(.secondary)
                                    .monospacedDigit()
                            }
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 24)
            }
            .padding(.top, 4)
        }
        .background(Color(.systemGroupedBackground))
        .navigationDestination(item: $selected) { receipt in
            DetailView(receipt: receipt)
        }
    }
}

struct BoxesView: View {
    @EnvironmentObject private var store: AvaStore
    @State private var selected: Receipt?

    var body: some View {
        ScrollView {
            LazyVGrid(columns: [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)], spacing: 16) {
                ForEach(AvaCategory.allCases.filter { $0 != .other }) { cat in
                    NavigationLink {
                        CategoryView(category: cat)
                    } label: {
                        VStack(alignment: .leading, spacing: 6) {
                            DrawerView(receipts: Array(store.inCategory(cat).prefix(3))) { selected = $0 }
                            Text(cat.label)
                                .font(.subheadline.weight(.semibold))
                                .foregroundStyle(.primary)
                            Text(String(format: "₹%.2f ×%d", store.total(cat), store.inCategory(cat).count))
                                .font(.footnote)
                                .foregroundStyle(.secondary)
                                .monospacedDigit()
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(20)
        }
        .background(Color(.systemGroupedBackground))
        .navigationDestination(item: $selected) { receipt in
            DetailView(receipt: receipt)
        }
    }
}

struct CategoryView: View {
    @EnvironmentObject private var store: AvaStore
    let category: AvaCategory
    @State private var selected: Receipt?

    var body: some View {
        List {
            Section {
                DrawerView(receipts: store.inCategory(category)) { selected = $0 }
                    .listRowInsets(EdgeInsets())
                    .listRowBackground(Color.clear)
                    .listRowSeparator(.hidden)
            }
            Section {
                ForEach(store.inCategory(category)) { receipt in
                    Button {
                        selected = receipt
                    } label: {
                        HStack {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(receipt.merchant)
                                Text(receipt.date)
                                    .font(.footnote)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            Text(String(format: "₹%.2f", receipt.amount))
                                .monospacedDigit()
                                .foregroundStyle(.secondary)
                        }
                    }
                    .foregroundStyle(.primary)
                }
            }
        }
        .listStyle(.insetGrouped)
        .navigationTitle(category.label)
        .navigationBarTitleDisplayMode(.large)
        .navigationDestination(item: $selected) { receipt in
            DetailView(receipt: receipt)
        }
    }
}

struct DetailView: View {
    let receipt: Receipt

    var body: some View {
        Image(receipt.imageName)
            .resizable()
            .aspectRatio(contentMode: .fit)
            .padding(32)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color(.systemGroupedBackground))
            .navigationTitle(receipt.merchant)
            .navigationBarTitleDisplayMode(.inline)
    }
}

struct AddSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var merchant = "Ottimo Pizza"
    @State private var amount: Double = 0
    @State private var category: AvaCategory = .groceries
    var onSave: (Receipt) -> Void

    private let merchants = ["Ottimo Pizza", "Trader Joe's", "Blue Bottle", "Uber", "IKEA", "Whole Foods"]
    private let images = [
        "Ottimo Pizza": "SlipOttimo",
        "Trader Joe's": "SlipTJ",
        "Blue Bottle": "SlipBlueBottle",
        "Uber": "SlipUber",
        "IKEA": "SlipIkea",
        "Whole Foods": "SlipWF",
    ]

    var body: some View {
        NavigationStack {
            Form {
                Section("Merchant") {
                    Picker("Merchant", selection: $merchant) {
                        ForEach(merchants, id: \.self) { Text($0).tag($0) }
                    }
                }
                Section("Amount") {
                    TextField("Amount", value: $amount, format: .currency(code: "INR"))
                        .keyboardType(.decimalPad)
                }
                Section("Box") {
                    Picker("Box", selection: $category) {
                        ForEach(AvaCategory.allCases.filter { $0 != .other }) { cat in
                            Text(cat.label).tag(cat)
                        }
                    }
                }
            }
            .navigationTitle("New Receipt")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        let rec = Receipt(
                            id: "n\(Int(Date().timeIntervalSince1970))",
                            merchant: merchant,
                            date: "26 AUG",
                            amount: amount,
                            category: category,
                            imageName: images[merchant] ?? "SlipOttimo",
                            pos: .init(x: 0.48, y: 0.52, rotation: 5, width: 0.20)
                        )
                        onSave(rec)
                    }
                    .fontWeight(.semibold)
                    .disabled(amount <= 0)
                }
            }
        }
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
    }
}
