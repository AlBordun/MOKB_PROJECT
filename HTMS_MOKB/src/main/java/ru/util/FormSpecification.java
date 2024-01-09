package ru.util;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import ru.models.Entities.Form;

@AllArgsConstructor
public class FormSpecification implements Specification<Form> {

    private SearchCriteria searchCriteria;
//    private Map<String, String> params;


    @Override
    public Predicate toPredicate(Root<Form> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
        if (searchCriteria.getOperation().equalsIgnoreCase("like")) {

            return criteriaBuilder.like(root.get(searchCriteria.getKey()), "%" + searchCriteria.getValue() + "%");
        }
        return null;
//        List<Predicate> predicates = new ArrayList<>();
//
//        return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
    }
}
